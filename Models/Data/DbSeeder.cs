using inspect_san.Models.Constants;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace inspect_san.Models.Data;

/// <summary>
/// Seed idempotent : référentiels (Communes/Régimes/TypesDecision/Équipes) + jeu de démo.
/// Référentiels si Equipes vide ; démo métier si Ecoles vide.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(InspectSanDbContext db, CancellationToken ct = default)
        => await SeedAsync(db, logger: null, ct);

    public static async Task SeedAsync(InspectSanDbContext db, ILogger? logger, CancellationToken ct = default)
    {
        if (!await db.Equipes.AnyAsync(ct))
            await SeedRefsAsync(db, ct);

        if (!await db.Ecoles.AnyAsync(ct))
        {
            await SeedRandomDemoAsync(db, ct);
            if (logger != null)
                await LogCoverageAsync(db, logger, ct);
        }

        await EnsureEquipeChefsAsync(db, logger, ct);
    }

    /// <summary>
    /// Backfill idempotent : équipes sans ChefControleurId → 1er membre actif (ou premier membre).
    /// </summary>
    public static async Task EnsureEquipeChefsAsync(InspectSanDbContext db, ILogger? logger = null, CancellationToken ct = default)
    {
        var equipesSansChef = await db.Equipes
            .Where(e => e.ChefControleurId == null)
            .ToListAsync(ct);
        if (equipesSansChef.Count == 0) return;

        var dejaChefs = await db.Equipes.AsNoTracking()
            .Where(e => e.ChefControleurId != null)
            .Select(e => e.ChefControleurId!)
            .ToListAsync(ct);
        var used = new HashSet<string>(dejaChefs);

        foreach (var eq in equipesSansChef)
        {
            var candidats = await db.Controleurs
                .Where(c => c.EquipeId == eq.Id)
                .OrderByDescending(c => c.Actif)
                .ThenBy(c => c.CreatedAt)
                .ToListAsync(ct);
            var chef = candidats.FirstOrDefault(c => !used.Contains(c.Id));
            if (chef == null) continue;
            eq.ChefControleurId = chef.Id;
            used.Add(chef.Id);
        }

        await db.SaveChangesAsync(ct);
        logger?.LogInformation("Backfill chefs d’équipe : {Count} équipe(s) mises à jour.", equipesSansChef.Count(e => e.ChefControleurId != null));
    }

    private static async Task SeedRefsAsync(InspectSanDbContext db, CancellationToken ct)
    {
        var communes = new[]
        {
            "Ngaba", "Lemba", "Limete", "Matete", "Kisenso", "Makala", "Kalamu",
            "Kasa-Vubu", "Bandalungwa", "Ngiri-Ngiri", "Selembao", "Mont-Ngafula"
        }.Select((n, i) => new Commune
        {
            Id = $"com-{i + 1:000}",
            Nom = n,
            Code = $"COM{i + 1:000}",
            Actif = true
        });

        var regimes = new[] { "Public", "Privé conventionné", "Privé non conventionné", "Confessionnel" }
            .Select((n, i) => new Regime
            {
                Id = $"reg-{i + 1:000}",
                Nom = n,
                Code = $"REG{i + 1:000}",
                Actif = true
            });

        var typesDecision = new[]
        {
            (DecisionTypes.Maintien, "Maintien"),
            (DecisionTypes.Avertissement, "Avertissement"),
            (DecisionTypes.Rehabilitation, "Réhabilitation"),
            (DecisionTypes.FermetureTemporaire, "Fermeture temporaire"),
            (DecisionTypes.FermetureDefinitive, "Fermeture définitive")
        }.Select((t, i) => new TypeDecision
        {
            Id = $"td-{i + 1:000}",
            Code = t.Item1,
            Nom = t.Item2,
            Libelle = t.Item2,
            Actif = true
        });

        var equipes = new[]
        {
            ("eq-001", "Équipe Alpha"),
            ("eq-002", "Équipe Beta"),
            ("eq-003", "Équipe Gamma")
        }.Select(t => new Equipe
        {
            Id = t.Item1,
            Nom = t.Item2,
            Actif = true,
            CreatedAt = DateTime.UtcNow
        });

        db.Communes.AddRange(communes);
        db.Regimes.AddRange(regimes);
        db.TypesDecision.AddRange(typesDecision);
        db.Equipes.AddRange(equipes);
        await db.SaveChangesAsync(ct);
    }

    /// <summary>Jeu scénarisé ~10/table : toutes les possibilités métier + chaînes cohérentes.</summary>
    public static async Task SeedRandomDemoAsync(InspectSanDbContext db, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var communes = await db.Communes.OrderBy(r => r.Id).ToListAsync(ct);
        var regimes = await db.Regimes.OrderBy(r => r.Id).ToListAsync(ct);
        var typesDecision = await db.TypesDecision.OrderBy(t => t.Id).ToListAsync(ct);
        var equipes = await db.Equipes.OrderBy(e => e.Id).ToListAsync(ct);

        if (communes.Count == 0 || regimes.Count == 0)
            throw new InvalidOperationException("Communes/Régimes requis avant SeedRandomDemoAsync.");
        if (equipes.Count < 2)
            throw new InvalidOperationException("Au moins 2 équipes requises avant SeedRandomDemoAsync.");
        if (typesDecision.Count == 0)
            throw new InvalidOperationException("TypesDecision requis avant SeedRandomDemoAsync.");

        string Td(string code) =>
            typesDecision.First(t => t.Code == code).Id;

        var noms = new[]
        {
            "Saint-Joseph", "Notre-Dame", "Lumumba", "Kimbaguiste", "Protestante",
            "Communautaire", "Espoir", "Avenir", "Réussite", "Progrès"
        };
        var quartiers = new[] { "Salongo", "Righini", "Livulu", "Yolo", "Matonge", "Binza", "Kinsuka", "Camp Luka" };
        var avenues = new[] { "Av. de l'Université", "Av. By-Pass", "Av. de la Libération", "Av. Sendwe", "Blvd Lumumba" };

        var ecoleSpecs = new (string Statut, int RegimeIdx)[]
        {
            (EcoleStatuts.Active, 0),
            (EcoleStatuts.Active, 1),
            (EcoleStatuts.Active, 2),
            (EcoleStatuts.Active, 3),
            (EcoleStatuts.Active, 0),
            (EcoleStatuts.Active, 1),
            (EcoleStatuts.FermetureTemporaire, 0),
            (EcoleStatuts.Rehabilitation, 3),
            (EcoleStatuts.FermetureDefinitive, 2),
            (EcoleStatuts.Active, 1),
        };

        var ecoles = new List<Ecole>();
        for (var i = 0; i < 10; i++)
        {
            var (statut, regIdx) = ecoleSpecs[i];
            var n = i + 1;
            var ecole = new Ecole
            {
                Id = $"eco-{n:000}",
                Denomination = $"École {noms[i]} n°{n}",
                RegimeId = regimes[regIdx % regimes.Count].Id,
                CommuneId = communes[i % communes.Count].Id,
                IdDinacope = $"DIN-KIN-MA-{n:0000}",
                NumAgrement = n % 2 == 0 ? $"AGR/2023/{n:000}" : null,
                NumNotification = n % 3 == 0 ? $"NOT/EPST/{n:000}" : null,
                Adresse = new Adresse
                {
                    Quartier = quartiers[i % quartiers.Length],
                    Avenue = avenues[i % avenues.Length],
                    Numero = $"{10 + n}A"
                },
                Statut = statut,
                CreatedAt = now.AddDays(-400 + n * 7),
                UpdatedAt = now.AddDays(-n)
            };

            if (n is 1 or 4 or 8)
            {
                ecole.Documents.Add(new DocumentMeta
                {
                    Nom = $"Agrement_{n}.pdf",
                    Taille = $"{120 + n * 10} Ko",
                    Date = now.AddDays(-200 + n)
                });
                if (n == 1)
                {
                    ecole.Documents.Add(new DocumentMeta
                    {
                        Nom = "Plan_site.pdf",
                        Taille = "340 Ko",
                        Date = now.AddDays(-180)
                    });
                }
            }

            ecoles.Add(ecole);
        }
        db.Ecoles.AddRange(ecoles);

        var chefEcoleIdx = new[] { 0, 1, 2, 3, 5, 6, 7, 8, 9, 0 };
        var chefNoms = new[]
        {
            "Kalala Mbuyi", "Ilunga Kabongo", "Mukendi Tshisekedi", "Ngalula Mbombo", "Kasongo Lwamba",
            "Mwamba Kabasele", "Tshimanga Mutombo", "Kabeya Ntumba", "Lukusa Mpiana", "Banza Kitenge"
        };
        var chefs = new List<Chef>();
        for (var i = 0; i < 10; i++)
        {
            var n = i + 1;
            chefs.Add(new Chef
            {
                Id = $"chef-{n:000}",
                NomComplet = $"Chef {chefNoms[i]}",
                IdDinacope = $"DIN-CHEF-{n:0000}",
                Telephone = $"+24381{1000000 + n * 111}",
                EcoleId = ecoles[chefEcoleIdx[i]].Id,
                AncienneteEnseignement = 8 + (i % 15),
                AncienneteChef = 2 + (i % 8),
                AncienneteEcole = 1 + (i % 6),
                CreatedAt = now.AddDays(-300 + n * 3)
            });
        }
        db.Chefs.AddRange(chefs);

        // Membres terrain (sans login) — répartis sur les équipes
        var controleurs = new List<Controleur>
        {
            new() { Id = "ctrl-001", NomComplet = "Membre Nsimba", Telephone = "+243810002001", EquipeId = "eq-001", Actif = true, CreatedAt = now.AddDays(-100) },
            new() { Id = "ctrl-002", NomComplet = "Membre Kabila", Telephone = "+243810002002", EquipeId = "eq-001", Actif = true, CreatedAt = now.AddDays(-90) },
            new() { Id = "ctrl-003", NomComplet = "Membre Tshala", Telephone = "+243810002003", EquipeId = "eq-002", Actif = true, CreatedAt = now.AddDays(-80) },
            new() { Id = "ctrl-004", NomComplet = "Membre Lukusa", Telephone = "+243810002004", EquipeId = "eq-002", Actif = true, CreatedAt = now.AddDays(-70) },
            new() { Id = "ctrl-005", NomComplet = "Membre Mpiana", Telephone = "+243810002005", EquipeId = "eq-003", Actif = true, CreatedAt = now.AddDays(-60) },
            new() { Id = "ctrl-006", NomComplet = "Membre Banza (inactif)", EquipeId = "eq-003", Actif = false, CreatedAt = now.AddDays(-50) },
        };
        db.Controleurs.AddRange(controleurs);
        await db.SaveChangesAsync(ct);

        // 1 équipe = 1 chef (membre Controleur) — pas de compte Identity créé ici
        var chefParEquipe = new Dictionary<string, string>
        {
            ["eq-001"] = "ctrl-001",
            ["eq-002"] = "ctrl-003",
            ["eq-003"] = "ctrl-005"
        };
        foreach (var eq in equipes)
        {
            if (chefParEquipe.TryGetValue(eq.Id, out var chefId))
                eq.ChefControleurId = chefId;
        }
        await db.SaveChangesAsync(ct);

        Chef? ChefFor(string ecoleId) => chefs.FirstOrDefault(c => c.EcoleId == ecoleId);

        OrdreMission MakeOm(
            int n, string ecoleId, string equipeId, string statut,
            int emitDaysAgo, int debutOffset, int finOffset, bool signed, string? objet = null)
        {
            return new OrdreMission
            {
                Id = $"om-{n:000}",
                Numero = $"OM-2026-{n:000}",
                EcoleId = ecoleId,
                EquipeId = equipeId,
                Statut = statut,
                DateEmission = now.AddDays(-emitDaysAgo),
                DebutValidite = now.AddDays(debutOffset),
                FinValidite = now.AddDays(finOffset),
                DateMission = now.AddDays(debutOffset + 1),
                SigneLe = signed ? now.AddDays(-emitDaysAgo + 1) : null,
                SignePar = signed ? "usr-002" : null,
                Objet = objet ?? "Contrôle sanitaire de routine",
                CreatedAt = now.AddDays(-emitDaysAgo - 1)
            };
        }

        var eqA = "eq-001";
        var eqB = "eq-002";
        var eqC = equipes.Count >= 3 ? "eq-003" : eqB;

        var ordres = new List<OrdreMission>
        {
            MakeOm(1, "eco-001", eqA, OrdreStatuts.Brouillon, 2, 1, 30, false),
            MakeOm(2, "eco-002", eqB, OrdreStatuts.EnAttenteSignature, 5, 0, 25, false, "Mission d'inspection annuelle"),
            MakeOm(3, "eco-003", eqA, OrdreStatuts.Signe, 12, -2, 20, true),
            MakeOm(4, "eco-004", eqA, OrdreStatuts.EnCours, 20, -10, 15, true, "Contrôle suites plainte riverains"),
            MakeOm(5, "eco-005", eqB, OrdreStatuts.EnCours, 25, -15, 10, true),
            MakeOm(6, "eco-006", eqA, OrdreStatuts.Cloture, 60, -50, -5, true, "Mission clôturée — suivi Impact 7%"),
            MakeOm(7, "eco-007", eqA, OrdreStatuts.Cloture, 70, -60, -10, true),
            MakeOm(8, "eco-008", eqC, OrdreStatuts.Cloture, 80, -70, -20, true),
            MakeOm(9, "eco-009", eqB, OrdreStatuts.Cloture, 90, -85, -30, true),
            MakeOm(10, "eco-010", eqA, OrdreStatuts.Signe, 40, -30, 5, true, "Inspection approfondie multi-constats"),
        };
        db.OrdresMission.AddRange(ordres);

        // 6 valeurs pour les index du seed ; « Dégradé » legacy → bucket Dégradé via ToStatBucket.
        var etats = new[]
        {
            EtatBatiment.Satisfaisant,
            EtatBatiment.Bon,
            EtatBatiment.Moyen,
            EtatBatiment.Mauvais,
            "Dégradé",
            EtatBatiment.Critique
        };

        var recos = new[] { "Maintien", "Avertissement", "Réhabilitation", "Fermeture temporaire", "Fermeture définitive" };

        FicheControle MakeFiche(
            int n, OrdreMission om, string statut, string etat, string reco,
            bool withPhotos, bool linkChef, int daysAgo)
        {
            var chef = linkChef ? ChefFor(om.EcoleId) : null;
            var f = new FicheControle
            {
                Id = $"fc-{n:000}",
                Numero = $"FC-2026-{n:000}",
                OrdreMissionId = om.Id,
                EcoleId = om.EcoleId,
                ChefId = chef?.Id,
                Statut = statut,
                ProduitsAutres = n % 3 == 0 ? "Désinfectant sol" : "",
                Observations = $"Observations démo fiche {n} — état {etat.ToLowerInvariant()}.",
                RecommandationPreliminaire = reco,
                ValideePar = statut == FicheStatuts.Validee ? "usr-003" : null,
                ValideeLe = statut == FicheStatuts.Validee ? now.AddDays(-daysAgo + 2) : null,
                CreatedAt = now.AddDays(-daysAgo),
                UpdatedAt = now.AddDays(-daysAgo + 1),
                SectionBatiments = new SectionBatiments
                {
                    NombreBatiments = 1 + (n % 5),
                    EtatGeneral = etat,
                    NombreEleves = 150 + n * 37,
                    ToilettesFilles = n % 2 == 0 ? "4 fonctionnelles" : "2 hors service",
                    ToilettesGarcons = n % 2 == 0 ? "3 fonctionnelles" : "1 dégradée"
                },
                SectionImpact7 = new SectionImpact7
                {
                    MontantPercu = n % 2 == 0 ? $"{80000 + n * 5500} FC" : "0",
                    ProduitsNettoyage = n % 2 == 0 ? ["Javel", "Savon"] : n % 3 == 0 ? ["Javel"] : [],
                    Quantite = n % 2 == 0 ? "10L Javel, 2 cartons savon" : ""
                }
            };

            if (withPhotos)
            {
                f.Photos.Add(new PhotoMeta
                {
                    Nom = $"constat_{n}_a.jpg",
                    Legende = "Vue latrines",
                    Url = $"/uploads/demo/fc-{n:000}-a.jpg"
                });
                if (n % 2 == 0)
                {
                    f.Photos.Add(new PhotoMeta
                    {
                        Nom = $"constat_{n}_b.jpg",
                        Legende = "Cour / drainage",
                        Url = $"/uploads/demo/fc-{n:000}-b.jpg"
                    });
                }
            }

            return f;
        }

        var fiches = new List<FicheControle>
        {
            MakeFiche(1, ordres[2], FicheStatuts.Brouillon, etats[0], recos[0], false, true, 8),
            MakeFiche(2, ordres[3], FicheStatuts.EnAttenteValidation, etats[2], recos[1], true, true, 15),
            MakeFiche(3, ordres[4], FicheStatuts.Validee, etats[1], recos[0], true, false, 18),
            MakeFiche(4, ordres[5], FicheStatuts.Validee, etats[4], recos[2], false, true, 45),
            MakeFiche(5, ordres[5], FicheStatuts.Validee, etats[2], recos[1], true, true, 44),
            MakeFiche(6, ordres[6], FicheStatuts.Validee, etats[5], recos[3], true, true, 55),
            MakeFiche(7, ordres[7], FicheStatuts.Validee, etats[3], recos[2], false, true, 65),
            MakeFiche(8, ordres[8], FicheStatuts.Validee, etats[5], recos[4], true, true, 75),
            MakeFiche(9, ordres[9], FicheStatuts.Validee, etats[0], recos[0], true, true, 28),
            MakeFiche(10, ordres[9], FicheStatuts.Validee, etats[1], recos[0], false, true, 27),
        };
        db.FichesControle.AddRange(fiches);

        Rapport MakeRapport(
            int n, string ecoleId, string statut, IReadOnlyList<FicheControle> linked,
            int createdDaysAgo, string synthese)
        {
            var r = new Rapport
            {
                Id = $"rap-{n:000}",
                Numero = $"RAP-2026-{n:000}",
                EcoleId = ecoleId,
                FicheIds = linked.Select(f => f.Id).ToList(),
                Synthese = synthese,
                Statut = statut,
                CreatedAt = now.AddDays(-createdDaysAgo)
            };

            foreach (var f in linked)
            {
                r.RapportFiches.Add(new RapportFiche
                {
                    RapportId = r.Id,
                    FicheControleId = f.Id
                });
            }

            if (statut is RapportStatuts.Depose or RapportStatuts.Accuse or RapportStatuts.Transmis or RapportStatuts.Traite)
            {
                r.DeposeLe = now.AddDays(-createdDaysAgo + 2);
                r.DeposePar = "usr-003";
            }
            if (statut is RapportStatuts.Accuse or RapportStatuts.Transmis or RapportStatuts.Traite)
            {
                r.AccuseReceptionLe = now.AddDays(-createdDaysAgo + 4);
                r.AccusePar = "usr-005";
            }
            if (statut is RapportStatuts.Transmis or RapportStatuts.Traite)
                r.TransmisLe = now.AddDays(-createdDaysAgo + 6);

            return r;
        }

        var rapports = new List<Rapport>
        {
            MakeRapport(1, "eco-005", RapportStatuts.Brouillon, [fiches[2]], 16,
                "Synthèse en cours — école sans chef d'établissement."),
            MakeRapport(2, "eco-006", RapportStatuts.Depose, [fiches[3]], 40,
                "Rapport déposé — non-conformités Impact 7%."),
            MakeRapport(3, "eco-006", RapportStatuts.Accuse, [fiches[4]], 38,
                "Accusé de réception enregistré par le secrétariat."),
            MakeRapport(4, "eco-007", RapportStatuts.Transmis, [fiches[5]], 50,
                "Rapport transmis au DP — en attente de décision."),
            MakeRapport(5, "eco-010", RapportStatuts.Traite, [fiches[8], fiches[9]], 25,
                "Inspection multi-constats : établissement conforme."),
            MakeRapport(6, "eco-004", RapportStatuts.Traite, [fiches[1]], 12,
                "Réserves mineures — avertissement recommandé."),
            MakeRapport(7, "eco-008", RapportStatuts.Traite, [fiches[6]], 60,
                "Travaux de réhabilitation sanitaire nécessaires."),
            MakeRapport(8, "eco-003", RapportStatuts.Brouillon, [fiches[0]], 6,
                "Brouillon lié à une fiche encore en rédaction."),
            MakeRapport(9, "eco-009", RapportStatuts.Traite, [fiches[7]], 70,
                "Non-conformités critiques répétées — fermeture définitive."),
            MakeRapport(10, "eco-007", RapportStatuts.Traite, [fiches[5]], 48,
                "Décision de fermeture temporaire suite aux risques majeurs."),
        };
        db.Rapports.AddRange(rapports);

        var decisions = new List<Decision>
        {
            new()
            {
                Id = "dec-001", Numero = "DEC-2026-0001", RapportId = "rap-005", EcoleId = "eco-010",
                TypeDecisionId = Td(DecisionTypes.Maintien), StatutExecution = StatutsExecution.Executee,
                Motif = "Établissement conforme aux normes sanitaires.",
                Commentaire = "Maintenir le suivi annuel.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-18), CreatedAt = now.AddDays(-19)
            },
            new()
            {
                Id = "dec-002", Numero = "DEC-2026-0002", RapportId = "rap-006", EcoleId = "eco-004",
                TypeDecisionId = Td(DecisionTypes.Avertissement), DelaiExecution = "15 jours",
                StatutExecution = StatutsExecution.EnAttente,
                Motif = "Manquements mineurs constatés.",
                Commentaire = "Notification au chef d'établissement.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-5), CreatedAt = now.AddDays(-6)
            },
            new()
            {
                Id = "dec-003", Numero = "DEC-2026-0003", RapportId = "rap-007", EcoleId = "eco-008",
                TypeDecisionId = Td(DecisionTypes.Rehabilitation), DelaiExecution = "90 jours",
                StatutExecution = StatutsExecution.EnCours,
                Motif = "Infrastructures sanitaires à réhabiliter.",
                Commentaire = "Plan de travaux transmis à la division.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-50), CreatedAt = now.AddDays(-52)
            },
            new()
            {
                Id = "dec-004", Numero = "DEC-2026-0004", RapportId = "rap-010", EcoleId = "eco-007",
                TypeDecisionId = Td(DecisionTypes.FermetureTemporaire), DelaiExecution = "30 jours",
                StatutExecution = StatutsExecution.EnCours,
                Motif = "Risques sanitaires majeurs.",
                Commentaire = "Fermeture temporaire jusqu'à mise en conformité.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-40), CreatedAt = now.AddDays(-42)
            },
            new()
            {
                Id = "dec-005", Numero = "DEC-2026-0005", RapportId = "rap-009", EcoleId = "eco-009",
                TypeDecisionId = Td(DecisionTypes.FermetureDefinitive), StatutExecution = StatutsExecution.Executee,
                Motif = "Non-conformités critiques répétées.",
                Commentaire = "Radiation proposée au fichier DINACOPE.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-60), CreatedAt = now.AddDays(-62)
            },
            new()
            {
                Id = "dec-006", Numero = "DEC-2026-0006", RapportId = "rap-005", EcoleId = "eco-010",
                TypeDecisionId = Td(DecisionTypes.Maintien), StatutExecution = StatutsExecution.EnAttente,
                Motif = "Décision de suivi complémentaire.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-17), CreatedAt = now.AddDays(-17)
            },
            new()
            {
                Id = "dec-007", Numero = "DEC-2026-0007", RapportId = "rap-006", EcoleId = "eco-004",
                TypeDecisionId = Td(DecisionTypes.Avertissement), DelaiExecution = "7 jours",
                StatutExecution = StatutsExecution.Executee,
                Motif = "Avertissement antérieur exécuté.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-4), CreatedAt = now.AddDays(-4)
            },
            new()
            {
                Id = "dec-008", Numero = "DEC-2026-0008", RapportId = "rap-007", EcoleId = "eco-008",
                TypeDecisionId = Td(DecisionTypes.Rehabilitation), DelaiExecution = "60 jours",
                StatutExecution = StatutsExecution.EnAttente,
                Motif = "Phase 2 réhabilitation (attente budget).",
                DecidePar = "usr-002", DecideLe = now.AddDays(-48), CreatedAt = now.AddDays(-48)
            },
            new()
            {
                Id = "dec-009", Numero = "DEC-2026-0009", RapportId = "rap-010", EcoleId = "eco-007",
                TypeDecisionId = Td(DecisionTypes.FermetureTemporaire), DelaiExecution = "45 jours",
                StatutExecution = StatutsExecution.Executee,
                Motif = "Fermeture temporaire confirmée et notifiée.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-35), CreatedAt = now.AddDays(-35)
            },
            new()
            {
                Id = "dec-010", Numero = "DEC-2026-0010", RapportId = "rap-009", EcoleId = "eco-009",
                TypeDecisionId = Td(DecisionTypes.FermetureDefinitive), StatutExecution = StatutsExecution.EnAttente,
                Motif = "Validation administrative finale en attente.",
                DecidePar = "usr-002", DecideLe = now.AddDays(-55), CreatedAt = now.AddDays(-55)
            },
        };
        db.Decisions.AddRange(decisions);

        await db.SaveChangesAsync(ct);
    }

    public static async Task LogCoverageAsync(InspectSanDbContext db, ILogger logger, CancellationToken ct = default)
    {
        var ecoles = await db.Ecoles.CountAsync(ct);
        var chefs = await db.Chefs.CountAsync(ct);
        var oms = await db.OrdresMission.CountAsync(ct);
        var fiches = await db.FichesControle.CountAsync(ct);
        var rapports = await db.Rapports.CountAsync(ct);
        var decisions = await db.Decisions.CountAsync(ct);
        var communes = await db.Communes.CountAsync(ct);
        var regimes = await db.Regimes.CountAsync(ct);
        var types = await db.TypesDecision.CountAsync(ct);
        var equipes = await db.Equipes.CountAsync(ct);
        var controleurs = await db.Controleurs.CountAsync(ct);
        var rapFiches = await db.RapportFiches.CountAsync(ct);

        logger.LogInformation(
            "Seed démo OK — Ecoles={Ecoles} Chefs={Chefs} OM={Om} Fiches={Fiches} Rapports={Rapports} Decisions={Decisions} Communes={Communes} Regimes={Regimes} TypesDecision={Types} Equipes={Equipes} Controleurs={Ctrl} RapportFiches={Rf}",
            ecoles, chefs, oms, fiches, rapports, decisions, communes, regimes, types, equipes, controleurs, rapFiches);

        async Task LogGroup<T>(string label, IQueryable<T> q, System.Linq.Expressions.Expression<Func<T, string>> key)
        {
            var rows = await q.GroupBy(key).Select(g => new { g.Key, N = g.Count() }).ToListAsync(ct);
            logger.LogInformation("{Label}: {X}", label, string.Join(", ", rows.Select(x => $"{x.Key}={x.N}")));
        }

        await LogGroup("Ecoles.Statut", db.Ecoles.AsQueryable(), e => e.Statut);
        await LogGroup("OM.Statut", db.OrdresMission.AsQueryable(), o => o.Statut);
        await LogGroup("OM.EquipeId", db.OrdresMission.AsQueryable(), o => o.EquipeId);
        await LogGroup("Fiches.Statut", db.FichesControle.AsQueryable(), f => f.Statut);
        await LogGroup("Rapports.Statut", db.Rapports.AsQueryable(), r => r.Statut);
        await LogGroup("Decisions.TypeDecisionId", db.Decisions.AsQueryable(), d => d.TypeDecisionId);
        await LogGroup("Decisions.Exec", db.Decisions.AsQueryable(), d => d.StatutExecution);
    }
}
