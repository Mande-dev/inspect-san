using inspect_san.Models.Constants;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace inspect_san.Models.Data;

/// <summary>Initialise les données de référence et le jeu de démo.</summary>
public static class DbSeeder
{
    /// <summary>Orchestre le seed (sous-provinces, refs, démo ou migration).</summary>
    public static async Task SeedAsync(InspectSanDbContext db, CancellationToken ct = default)
        => await SeedAsync(db, logger: null, ct);

    /// <summary>Orchestre le seed avec journalisation optionnelle de la couverture.</summary>
    public static async Task SeedAsync(InspectSanDbContext db, ILogger? logger, CancellationToken ct = default)
    {
        await SeedSousProvincesAsync(db, ct);

        if (!await db.Categories.AnyAsync(ct))
            await SeedRefsAsync(db, ct);

        if (!await db.Ecoles.AnyAsync(ct))
        {
            await SeedRandomDemoAsync(db, ct);
            if (logger != null)
                await LogCoverageAsync(db, logger, ct);
        }
        else
            await MigrateEcoleSousDivisionCodesAsync(db, ct);
    }

    /// <summary>Insère les sous-provinces absentes depuis le catalogue (toujours sûr à appeler).</summary>
    public static async Task EnsureSousProvincesAsync(InspectSanDbContext db, CancellationToken ct = default)
        => await SeedSousProvincesAsync(db, ct);

    /// <summary>Insère les sous-provinces absentes depuis le catalogue.</summary>
    private static async Task SeedSousProvincesAsync(InspectSanDbContext db, CancellationToken ct)
    {
        foreach (var row in SousProvinceCatalog.Rows)
        {
            if (await db.SousProvinces.AnyAsync(s => s.Code == row.Code, ct))
                continue;
            db.SousProvinces.Add(new SousProvince { Code = row.Code, Libelle = row.Libelle });
        }
        await db.SaveChangesAsync(ct);
    }

    /// <summary>Convertit d'anciens codes legacy (kinsenso_1…) vers SP00x si encore présents.</summary>
    private static async Task MigrateEcoleSousDivisionCodesAsync(InspectSanDbContext db, CancellationToken ct)
    {
        var ecoles = await db.Ecoles.ToListAsync(ct);
        var changed = false;
        foreach (var e in ecoles)
        {
            var mapped = SousProvinceCatalog.CodeFromLegacyOrCode(e.SousDivision);
            if (mapped != null && mapped != e.SousDivision)
            {
                e.SousDivision = mapped;
                changed = true;
            }
        }
        if (changed)
            await db.SaveChangesAsync(ct);
    }

    /// <summary>Seed des référentiels (catégories, produits, outils).</summary>
    private static async Task SeedRefsAsync(InspectSanDbContext db, CancellationToken ct)
    {
        db.Categories.AddRange(
            new Categorie { Designation = "Collège" },
            new Categorie { Designation = "Complexe scolaire" },
            new Categorie { Designation = "Groupe scolaire" },
            new Categorie { Designation = "EP" },
            new Categorie { Designation = "Lycée" },
            new Categorie { Designation = "Institut" },
            new Categorie { Designation = "École" });

        db.Produits.AddRange(
            new Produit { LibeleProduit = "Javel" },
            new Produit { LibeleProduit = "Savon" },
            new Produit { LibeleProduit = "Désinfectant" },
            new Produit { LibeleProduit = "Eau de Javel concentrée" },
            new Produit { LibeleProduit = "Détergent" });

        db.Outils.AddRange(
            new Outil { LibelleOutile = "Balai" },
            new Outil { LibelleOutile = "Seau" });

        await db.SaveChangesAsync(ct);
    }

    /// <summary>Génère un jeu de démo (écoles, agents, missions, décisions).</summary>
    public static async Task SeedRandomDemoAsync(InspectSanDbContext db, CancellationToken ct = default)
    {
        var now = DateTime.UtcNow;
        var regCodes = RegGes.All.ToList();
        var divCodes = await db.SousProvinces.AsNoTracking().OrderBy(s => s.Code).Select(s => s.Code).ToListAsync(ct);
        if (divCodes.Count == 0)
            divCodes = SousProvinceCatalog.Rows.Select(r => r.Code).ToList();
        var catCodes = await db.Categories.AsNoTracking().Select(c => c.CodeCategories).ToListAsync(ct);
        if (catCodes.Count == 0)
            throw new InvalidOperationException("Seed: aucune catégorie.");

        var produitCode = await db.Produits.AsNoTracking().Select(p => p.CodeProduit).FirstOrDefaultAsync(ct);
        var outilCode = await db.Outils.AsNoTracking().Select(o => o.CodeOutile).FirstOrDefaultAsync(ct);

        var noms = new[]
        {
            "Saint-Joseph", "Notre-Dame", "Lumumba", "Kimbaguiste", "Protestante",
            "Communautaire", "Espoir", "Avenir", "Réussite", "Progrès"
        };

        var chefs = new List<Chef>();
        for (var i = 0; i < 10; i++)
        {
            var n = i + 1;
            chefs.Add(new Chef
            {
                Matricule = $"CHEF-{n:0000}",
                NomComplet = $"Chef {noms[i]}",
                Telephone = $"+24381000{2000 + n}",
                AnneeDebutActivite = now.Year - n
            });
        }
        db.ChefEtablissements.AddRange(chefs);
        await db.SaveChangesAsync(ct);

        var ecoles = new List<Ecole>();
        for (var i = 0; i < 10; i++)
        {
            var n = i + 1;
            ecoles.Add(new Ecole
            {
                Id = $"eco-{n:000}",
                NumAgrement = $"AGR/2023/{n:000}",
                Denomination = $"École {noms[i]} n°{n}",
                RegGes = regCodes[i % regCodes.Count],
                SousDivision = divCodes[i % divCodes.Count],
                CodeCategories = catCodes[i % catCodes.Count],
                IdDinacope = $"DIN-KIN-MA-{n:0000}",
                NumNotification = n % 3 == 0 ? $"NOT/EPST/{n:000}" : null,
                Adresse = $"Av. Demo {n}, N° {n}, Quartier Centre, Commune {SousDivision.LabelOf(divCodes[i % divCodes.Count])}",
                MatriculeChef = chefs[i].Matricule
            });
        }
        db.Ecoles.AddRange(ecoles);

        var agents = new List<Agent>
        {
            new() { MatrAgent = "agt-001", NomAgent = "Agent Nsimba", TelAgent = "+243810002001", Actif = true },
            new() { MatrAgent = "agt-002", NomAgent = "Agent Kabila", TelAgent = "+243810002002", Actif = true },
            new() { MatrAgent = "agt-003", NomAgent = "Agent Tshala", TelAgent = "+243810002003", Actif = true },
            new() { MatrAgent = "agt-004", NomAgent = "Agent Lukusa", TelAgent = "+243810002004", Actif = true },
            new() { MatrAgent = "agt-005", NomAgent = "Agent Mpiana", TelAgent = "+243810002005", Actif = true },
        };
        db.Agents.AddRange(agents);
        await db.SaveChangesAsync(ct);

        Mission MakeMission(int n, Ecole ecole, string statut, bool withFiche, string ficheStatut)
        {
            var numero = $"OM-2026-{n:000}";
            var m = new Mission
            {
                Id = $"mis-{n:000}",
                NumOrdre = numero,
                NumAgrement = ecole.NumAgrement,
                NomEquipe = $"Equipe-{numero}",
                Validite = statut,
                DateDebut = now.AddDays(-n * 2),
                DateFin = now.AddDays(30 - n),
                Objet = "Contrôle sanitaire de routine",
                CreatedAt = now.AddDays(-n * 2)
            };
            m.Affectations.Add(new Affectation { NomOrdre = numero, MatrAgent = "agt-001", Fonction = RolesMissionCodes.ChefEquipe });
            m.Affectations.Add(new Affectation { NomOrdre = numero, MatrAgent = "agt-002", Fonction = RolesMissionCodes.ChefAdjoint });

            if (withFiche)
            {
                m.StatutFiche = ficheStatut;
                m.NbreBatiment = 2 + n % 3;
                m.EtatBatiment = EtatBatiment.Satisfaisant;
                m.NbrEleve = 200 + n * 20;
                m.NbrToiletteFille = 2;
                m.NbrToiletteGarcon = 2;
                m.MontPer = 50000 + n * 1000;
                m.CodeProduit = produitCode > 0 ? produitCode : null;
                m.NbreProduit = 3;
                if (produitCode > 0)
                {
                    m.MissionProduits.Add(new MissionProduit
                    {
                        NumOrdre = numero,
                        CodeProduit = produitCode,
                        Quantite = 3
                    });
                }
                if (outilCode > 0)
                {
                    m.CodeOutil = outilCode;
                    m.NbreOutil = 2;
                    m.MissionOutils.Add(new MissionOutil
                    {
                        NumOrdre = numero,
                        CodeOutil = outilCode,
                        Quantite = 2
                    });
                }
                m.Observation = $"Observations démo mission {n}.";
                m.RecommandationPreliminaire = "Maintien";
                if (ficheStatut == FicheStatuts.Validee)
                {
                    m.ValideePar = "usr-003";
                    m.ValideeLe = now.AddDays(-1);
                }
            }
            return m;
        }

        var statuts = new[]
        {
            MissionStatuts.Brouillon, MissionStatuts.EnAttenteSignature, MissionStatuts.Signe,
            MissionStatuts.EnCours, MissionStatuts.EnCours, MissionStatuts.Cloture,
            MissionStatuts.Cloture, MissionStatuts.Cloture, MissionStatuts.Cloture, MissionStatuts.Signe
        };
        var ficheStatuts = new[]
        {
            null, null, FicheStatuts.Brouillon, FicheStatuts.EnAttenteValidation,
            FicheStatuts.Validee, FicheStatuts.Validee, FicheStatuts.Validee,
            FicheStatuts.Validee, FicheStatuts.Validee, FicheStatuts.Validee
        };

        var missions = new List<Mission>();
        for (var i = 0; i < 10; i++)
        {
            missions.Add(MakeMission(i + 1, ecoles[i], statuts[i], ficheStatuts[i] != null, ficheStatuts[i] ?? FicheStatuts.Brouillon));
        }
        db.Missions.AddRange(missions);

        db.Decisions.AddRange(
            new Decision { NumDecision = "DEC-2026-0001", DecisionFin = DecisionTypes.Rehabilitation, NumOrdre = "OM-2026-009", NumAgrement = ecoles[9].NumAgrement },
            new Decision { NumDecision = "DEC-2026-0002", DecisionFin = DecisionTypes.SuspensionTemporaireChef, NumOrdre = "OM-2026-006", NumAgrement = ecoles[5].NumAgrement });

        await db.SaveChangesAsync(ct);
    }

    /// <summary>Journalise les effectifs après un seed démo.</summary>
    public static async Task LogCoverageAsync(InspectSanDbContext db, ILogger logger, CancellationToken ct = default)
    {
        logger.LogInformation(
            "Seed démo OK — Etablissements={Ecoles} Missions={Missions} Affectations={Aff} Decisions={Decisions} Agents={Agents} Produits={Produits} Categories={Cat} Chefs={Chefs}",
            await db.Ecoles.CountAsync(ct),
            await db.Missions.CountAsync(ct),
            await db.Affectations.CountAsync(ct),
            await db.Decisions.CountAsync(ct),
            await db.Agents.CountAsync(ct),
            await db.Produits.CountAsync(ct),
            await db.Categories.CountAsync(ct),
            await db.ChefEtablissements.CountAsync(ct));
    }
}
