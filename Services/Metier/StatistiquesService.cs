using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Statistiques, exports et rapports d'inspection.</summary>
public class StatistiquesService : IStatistiquesService
{
    private readonly InspectSanDbContext _db;
    /// <summary>Initialise le service statistiques avec le contexte EF.</summary>
    public StatistiquesService(InspectSanDbContext db) => _db = db;

    /// <summary>Calcule les statistiques selon le filtre fourni.</summary>
    public async Task<StatistiquesDto> GetAsync(StatistiquesFilterDto filter)
    {
        bool InRange(DateTime? iso)
        {
            if (!iso.HasValue) return true;
            if (!string.IsNullOrEmpty(filter.DateFrom) && iso < DateTime.Parse(filter.DateFrom)) return false;
            if (!string.IsNullOrEmpty(filter.DateTo) && iso > DateTime.Parse(filter.DateTo + "T23:59:59")) return false;
            return true;
        }

        var ecolesQ = _db.Ecoles.AsNoTracking().AsQueryable();
        if (!string.IsNullOrEmpty(filter.Sousproved))
        {
            var code = SousProvinceCatalog.CodeFromLegacyOrCode(filter.Sousproved) ?? filter.Sousproved;
            ecolesQ = ecolesQ.Where(e => e.SousDivision == code);
        }
        if (!string.IsNullOrEmpty(filter.Regime))
        {
            var code = RegGes.Labels.FirstOrDefault(kv => kv.Value == filter.Regime).Key ?? filter.Regime;
            ecolesQ = ecolesQ.Where(e => e.RegGes == code);
        }

        var ecoles = await ecolesQ.ToListAsync();
        var numAgrements = ecoles.Select(e => e.NumAgrement).ToHashSet();
        var fiches = (await _db.Missions.AsNoTracking()
                .Include(m => m.Ecole)
                .Include(m => m.MissionProduits)
                .Where(m => m.StatutFiche != null)
                .ToListAsync())
            .Where(f => numAgrements.Contains(f.NumAgrement) && InRange(f.CreatedAt)).ToList();
        var decisions = (await _db.Decisions.AsNoTracking().ToListAsync())
            .Where(d => numAgrements.Contains(d.NumAgrement)).ToList();

        var counts = EtatBatiment.StatBuckets.ToDictionary(b => b, _ => 0);
        foreach (var f in fiches)
        {
            var bucket = EtatBatiment.ToStatBucket(f.EtatBatiment);
            if (bucket != null && counts.ContainsKey(bucket))
                counts[bucket]++;
        }

        var totalReconnu = counts.Values.Sum();
        var conformes = counts[EtatBatiment.BucketBon] + counts[EtatBatiment.BucketMoyen];
        var taux = totalReconnu == 0 ? 0 : (int)Math.Round(100.0 * conformes / totalReconnu);

        var avecProduits = fiches.Where(f =>
            f.MissionProduits.Count > 0
            || f.CodeProduit.HasValue
            || !string.IsNullOrWhiteSpace(f.ProduitsAutres)).ToList();

        var mois = new[] { "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc." };
        var now = DateTime.UtcNow;
        var evo = Enumerable.Range(0, 6).Select(i =>
        {
            var d = new DateTime(now.Year, now.Month, 1).AddMonths(-5 + i);
            return new ChartPointDto
            {
                Label = mois[d.Month - 1],
                Value = fiches.Count(f => f.CreatedAt.Year == d.Year && f.CreatedAt.Month == d.Month)
            };
        }).ToList();

        return new StatistiquesDto
        {
            EcolesCount = ecoles.Count,
            FichesCount = fiches.Count,
            TauxConformite = taux,
            DecisionsCount = decisions.Count,
            Conformite = EtatBatiment.StatBuckets
                .Select(b => new ChartPointDto { Label = b, Value = counts[b] }).ToList(),
            DecisionsParType = decisions
                .GroupBy(d => DecisionTypes.LabelOf(d.DecisionFin) is { Length: > 0 } l ? l : "(sans type)")
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            ProduitsDeclares =
            [
                new() { Label = "Avec produits déclarés", Value = avecProduits.Count },
                new() { Label = "Sans produit", Value = fiches.Count - avecProduits.Count }
            ],
            Evolution = evo
        };
    }

    /// <summary>Exporte les statistiques au format CSV.</summary>
    public async Task<string> ExportCsvAsync(StatistiquesFilterDto filter)
    {
        var s = await GetAsync(filter);
        var lines = new List<string>
        {
            "Indicateur,Valeur",
            $"Ecoles,{s.EcolesCount}",
            $"Fiches,{s.FichesCount}",
            $"TauxConformite,{s.TauxConformite}",
            $"Decisions,{s.DecisionsCount}"
        };
        foreach (var d in s.DecisionsParType)
            lines.Add($"decision_{Escape(d.Label)},{d.Value}");
        foreach (var c in s.Conformite)
            lines.Add($"conformite_{Escape(c.Label)},{c.Value}");
        return string.Join('\n', lines);
    }

    /// <summary>Échappe une valeur pour le CSV.</summary>
    private static string Escape(string label)
        => label.Replace(',', '_').Replace('\n', ' ');

    /// <summary>Construit le rapport d'inspection pour une sous-division.</summary>
    public async Task<RapportInspectionResponseDto> GetRapportInspectionAsync(
        RapportInspectionFilterDto filter,
        string? role = null,
        string? agentId = null)
    {
        filter ??= new RapportInspectionFilterDto();
        var sdCode = SousProvinceCatalog.CodeFromLegacyOrCode(filter.Sousproved);
        if (string.IsNullOrWhiteSpace(sdCode))
        {
            return new RapportInspectionResponseDto
            {
                PeriodeLabel = "Choisir une sous-division",
                ToutesSousDivisions = false
            };
        }

        var sdLabel = await ResolveSousProvinceLabelAsync(sdCode);

        var fichesQ = _db.Missions.AsNoTracking()
            .Include(m => m.Ecole!)
                .ThenInclude(e => e.Categorie)
            .Include(m => m.Ecole!)
                .ThenInclude(e => e.ChefEtablissement)
            .Include(m => m.Affectations)
                .ThenInclude(a => a.Agent)
            .Include(m => m.MissionProduits)
                .ThenInclude(mp => mp.Produit)
            .Include(m => m.MissionOutils)
                .ThenInclude(mo => mo.Outil)
            .Include(m => m.Produit)
            .Include(m => m.Outil)
            .Where(m => m.StatutFiche == FicheStatuts.Validee
                        && m.Ecole != null
                        && m.Ecole.SousDivision == sdCode);

        var fiches = await fichesQ.ToListAsync();

        if (string.Equals(role, DataScope.RoleControleur, StringComparison.Ordinal)
            && !string.IsNullOrWhiteSpace(agentId))
        {
            fiches = fiches
                .Where(m => m.Affectations.Any(a =>
                    string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal)))
                .ToList();
        }

        var decisionByOrdre = await _db.Decisions.AsNoTracking()
            .ToDictionaryAsync(d => d.NumOrdre, d => d);

        var section = BuildRapportSection(sdCode, sdLabel, fiches, decisionByOrdre);
        var response = new RapportInspectionResponseDto
        {
            PeriodeLabel = sdLabel,
            ToutesSousDivisions = false,
            Sections = [section],
            TotalGenerale = section.TotaleSousDivision,
            MontantPercuGeneral = section.MontantPercuTotal,
            MissionsEligiblesCount = fiches.Count,
            EquipeDeposeCount = fiches.Count(m => m.RapportEquipeDeposeLe != null),
            SecretariatDeposeCount = fiches.Count(m => m.RapportSecretariatDeposeLe != null),
            ClosCount = fiches.Count(m => m.RapportClos)
        };

        var isControleur = string.Equals(role, DataScope.RoleControleur, StringComparison.Ordinal);
        var isSecretariatLike = string.Equals(role, DataScope.RoleSecretariat, StringComparison.Ordinal)
                                || string.Equals(role, DataScope.RoleAdmin, StringComparison.Ordinal);

        response.CanDeposerEquipe = isControleur
            && !string.IsNullOrWhiteSpace(agentId)
            && fiches.Any(m => !m.RapportClos
                               && m.RapportEquipeDeposeLe == null
                               && m.Affectations.Any(a =>
                                   string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal)
                                   && a.Fonction == RolesMissionCodes.ChefEquipe));
        // Transfert secrétariat : uniquement après dépôt équipe.
        response.CanDeposerSecretariat = isSecretariatLike
            && fiches.Any(m => !m.RapportClos
                               && m.RapportEquipeDeposeLe != null
                               && m.RapportSecretariatDeposeLe == null);
        response.CanCloturer = isSecretariatLike
            && fiches.Any(m => !m.RapportClos && m.RapportSecretariatDeposeLe != null);

        return response;
    }

    /// <summary>Dépose le rapport côté équipe pour une sous-division.</summary>
    public async Task<ApiResultDto> DeposerRapportEquipeAsync(string sousDivisionCode, string? userId, string? agentId)
    {
        var sdCode = SousProvinceCatalog.CodeFromLegacyOrCode(sousDivisionCode);
        if (string.IsNullOrWhiteSpace(sdCode) || string.IsNullOrWhiteSpace(agentId))
            return ApiResultDto.Fail("Sous-division ou agent invalide.");

        var missions = await LoadMissionsForSousDivisionAsync(sdCode);
        missions = missions
            .Where(m => m.Affectations.Any(a =>
                string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal)
                && a.Fonction == RolesMissionCodes.ChefEquipe))
            .ToList();
        if (missions.Count == 0)
            return ApiResultDto.Fail(
                "Aucune mission éligible : seul le chef d'équipe peut déposer le rapport pour ses missions.");

        var clos = missions.Where(m => m.RapportClos).ToList();
        if (clos.Count == missions.Count)
            return ApiResultDto.Fail("Rapport déjà clôturé pour ces missions.");

        var deja = missions.Where(m => !m.RapportClos && m.RapportEquipeDeposeLe != null).ToList();
        var aDeposer = missions.Where(m => !m.RapportClos && m.RapportEquipeDeposeLe == null).ToList();
        if (aDeposer.Count == 0)
            return ApiResultDto.Fail("Le rapport a déjà été déposé au secrétariat pour ces missions.");

        var now = DateTime.UtcNow;
        foreach (var m in aDeposer)
        {
            m.RapportEquipeDeposeLe = now;
            m.RapportEquipeDeposePar = userId;
        }
        await _db.SaveChangesAsync();
        return ApiResultDto.Ok(
            $"Rapport déposé au secrétariat ({aDeposer.Count} mission(s))."
            + (deja.Count > 0 ? $" {deja.Count} déjà déposée(s) ignorée(s)." : ""));
    }

    /// <summary>Dépose le rapport côté secrétariat pour une sous-division.</summary>
    public async Task<ApiResultDto> DeposerRapportSecretariatAsync(string sousDivisionCode, string? userId)
    {
        var sdCode = SousProvinceCatalog.CodeFromLegacyOrCode(sousDivisionCode);
        if (string.IsNullOrWhiteSpace(sdCode))
            return ApiResultDto.Fail("Sous-division invalide.");

        var missions = await LoadMissionsForSousDivisionAsync(sdCode);
        if (missions.Count == 0)
            return ApiResultDto.Fail("Aucune fiche validée pour cette sous-division.");

        if (missions.All(m => m.RapportClos))
            return ApiResultDto.Fail("Rapport déjà clôturé.");

        var sansDepotEquipe = missions
            .Where(m => !m.RapportClos && m.RapportEquipeDeposeLe == null)
            .ToList();
        var aTransferer = missions
            .Where(m => !m.RapportClos
                        && m.RapportEquipeDeposeLe != null
                        && m.RapportSecretariatDeposeLe == null)
            .ToList();
        if (aTransferer.Count == 0)
        {
            if (sansDepotEquipe.Count > 0)
                return ApiResultDto.Fail(
                    "Transfert impossible : le chef d'équipe doit d'abord déposer le rapport au secrétariat.");
            return ApiResultDto.Fail("Le rapport a déjà été transféré au Directeur Provincial pour ces missions.");
        }

        var now = DateTime.UtcNow;
        foreach (var m in aTransferer)
        {
            m.RapportSecretariatDeposeLe = now;
            m.RapportSecretariatDeposePar = userId;
        }
        await _db.SaveChangesAsync();
        return ApiResultDto.Ok(
            $"Rapport transféré au Directeur Provincial ({aTransferer.Count} mission(s)).");
    }

    /// <summary>Clôture le rapport d'une sous-division.</summary>
    public async Task<ApiResultDto> CloturerRapportAsync(string sousDivisionCode, string? userId, bool forceAdmin = false)
    {
        var sdCode = SousProvinceCatalog.CodeFromLegacyOrCode(sousDivisionCode);
        if (string.IsNullOrWhiteSpace(sdCode))
            return ApiResultDto.Fail("Sous-division invalide.");

        var missions = await LoadMissionsForSousDivisionAsync(sdCode);
        if (missions.Count == 0)
            return ApiResultDto.Fail("Aucune fiche validée pour cette sous-division.");

        var aCloturer = missions.Where(m => !m.RapportClos).ToList();
        if (aCloturer.Count == 0)
            return ApiResultDto.Ok("Rapport déjà clôturé.");

        if (!forceAdmin && aCloturer.Any(m => m.RapportSecretariatDeposeLe == null))
            return ApiResultDto.Fail(
                "Transférez d'abord le rapport au Directeur Provincial avant de clôturer.");

        var now = DateTime.UtcNow;
        foreach (var m in aCloturer)
        {
            m.RapportClos = true;
            m.RapportClosLe = now;
            m.RapportClosPar = userId;
        }
        await _db.SaveChangesAsync();
        return ApiResultDto.Ok($"Rapport clôturé ({aCloturer.Count} mission(s)).");
    }

    /// <summary>Charge les missions d'une sous-division.</summary>
    private async Task<List<Mission>> LoadMissionsForSousDivisionAsync(string sdCode)
        => await _db.Missions
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .Where(m => m.StatutFiche == FicheStatuts.Validee
                        && m.Ecole != null
                        && m.Ecole.SousDivision == sdCode)
            .ToListAsync();

    /// <summary>Résout le libellé d'une sous-province.</summary>
    private async Task<string> ResolveSousProvinceLabelAsync(string sdCode)
    {
        var fromDb = await _db.SousProvinces.AsNoTracking()
            .Where(s => s.Code == sdCode)
            .Select(s => s.Libelle)
            .FirstOrDefaultAsync();
        return fromDb ?? SousProvinceCatalog.LabelOf(sdCode);
    }

    /// <summary>Construit une section du rapport d'inspection.</summary>
    private static RapportInspectionDto BuildRapportSection(
        string sousDivisionCode,
        string sdLabel,
        List<Mission> matched,
        Dictionary<string, Decision> decisionByOrdre)
    {
        matched = matched
            .OrderBy(m => m.Ecole!.Denomination)
            .ThenBy(m => m.NumOrdre)
            .ToList();

        var counts = EtatBatiment.StatBuckets.ToDictionary(b => b, _ => 0);
        foreach (var f in matched)
        {
            var bucket = EtatBatiment.ToStatBucket(f.EtatBatiment);
            if (bucket != null && counts.ContainsKey(bucket))
                counts[bucket]++;
        }

        var totalReconnu = counts.Values.Sum();
        var conformes = counts[EtatBatiment.BucketBon] + counts[EtatBatiment.BucketMoyen];
        var taux = totalReconnu == 0 ? 0 : (int)Math.Round(100.0 * conformes / totalReconnu);

        var ordres = matched.Select(m => m.NumOrdre).ToHashSet();
        var decisions = ordres
            .Where(decisionByOrdre.ContainsKey)
            .Select(o => decisionByOrdre[o])
            .ToList();

        var periodeLabel = "Fiches validées";
        var ecolesCount = matched.Select(m => m.NumAgrement).Distinct().Count();
        var debuts = matched.Where(m => m.DateDebut.HasValue).Select(m => m.DateDebut!.Value).ToList();
        var fins = matched.Where(m => m.DateFin.HasValue).Select(m => m.DateFin!.Value).ToList();
        var lignes = matched.Select(m =>
        {
            decisionByOrdre.TryGetValue(m.NumOrdre, out var dec);
            var ligne = MapLigne(m);
            ligne.DecisionLabel = dec != null ? DecisionTypes.LabelOf(dec.DecisionFin) : "—";
            return ligne;
        }).ToList();

        var dto = new RapportInspectionDto
        {
            SousDivisionCode = sousDivisionCode,
            SousDivisionLabel = sdLabel,
            PeriodeLabel = periodeLabel,
            EcolesCount = ecolesCount,
            FichesCount = matched.Count,
            TauxConformite = taux,
            DecisionsCount = decisions.Count,
            RegGesResume = string.Join(", ",
                matched.Select(m => RegGes.LabelOf(m.Ecole!.RegGes)).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct()),
            MontantPercuTotal = matched.Sum(m => m.MontPer ?? 0),
            ObservationResume = string.Join(" ; ",
                matched.Select(m => m.Observation).Where(o => !string.IsNullOrWhiteSpace(o)).Distinct()),
            DateDebutMissionMin = debuts.Count > 0 ? debuts.Min() : null,
            DateFinMissionMax = fins.Count > 0 ? fins.Max() : null,
            TotaleSousDivision = matched.Count,
            Conformite = EtatBatiment.StatBuckets
                .Select(b => new ChartPointDto { Label = b, Value = counts[b] }).ToList(),
            DecisionsParType = decisions
                .GroupBy(d => DecisionTypes.LabelOf(d.DecisionFin) is { Length: > 0 } l ? l : "(sans type)")
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            Lignes = lignes
        };

        dto.SyntheseTexte = BuildSyntheseTexte(sdLabel, periodeLabel, dto);
        return dto;
    }

    /// <summary>Mappe une mission vers une ligne de rapport.</summary>
    private static RapportInspectionLigneDto MapLigne(Mission m)
    {
        var ecole = m.Ecole!;
        var chefEquipe = m.Affectations?
            .FirstOrDefault(a => a.Fonction == RolesMissionCodes.ChefEquipe)
            ?? m.Affectations?.FirstOrDefault();
        var produits = m.MissionProduits?.Count > 0
            ? string.Join(", ", m.MissionProduits
                .Select(mp => mp.Produit?.LibeleProduit)
                .Where(n => !string.IsNullOrWhiteSpace(n))!)
            : m.Produit?.LibeleProduit ?? "";
        if (string.IsNullOrWhiteSpace(produits) && !string.IsNullOrWhiteSpace(m.ProduitsAutres))
            produits = m.ProduitsAutres;
        else if (!string.IsNullOrWhiteSpace(m.ProduitsAutres))
            produits = string.IsNullOrWhiteSpace(produits) ? m.ProduitsAutres : produits + ", " + m.ProduitsAutres;

        var outils = m.MissionOutils?.Count > 0
            ? string.Join(", ", m.MissionOutils
                .Select(mo => mo.Outil?.LibelleOutile)
                .Where(n => !string.IsNullOrWhiteSpace(n))!)
            : m.Outil?.LibelleOutile ?? "";
        if (string.IsNullOrWhiteSpace(outils) && !string.IsNullOrWhiteSpace(m.OutilsAutres))
            outils = m.OutilsAutres;
        else if (!string.IsNullOrWhiteSpace(m.OutilsAutres))
            outils = string.IsNullOrWhiteSpace(outils) ? m.OutilsAutres : outils + ", " + m.OutilsAutres;

        return new RapportInspectionLigneDto
        {
            NumOrdre = m.NumOrdre,
            MissionId = m.Id,
            EcoleNom = ecole.Denomination,
            FonctionControleur = RolesMissionCodes.LabelOf(chefEquipe?.Fonction),
            NumAgrement = ecole.NumAgrement,
            NomAgent = chefEquipe?.Agent?.NomAgent
                       ?? chefEquipe?.Agent?.NomComplet
                       ?? "—",
            EtatBatiment = m.EtatBatiment,
            NombreBatiments = m.NbreBatiment,
            ToilettesFilles = m.NbrToiletteFille,
            ToilettesGarcons = m.NbrToiletteGarcon,
            NombreEleves = m.NbrEleve,
            DesignationProduit = string.IsNullOrWhiteSpace(produits) ? "—" : produits,
            DesignationOutil = string.IsNullOrWhiteSpace(outils) ? "—" : outils,
            IdDinacope = ecole.IdDinacope,
            ChefNom = ecole.ChefEtablissement?.NomComplet ?? "—",
            Regime = RegGes.LabelOf(ecole.RegGes),
            MontPer = m.MontPer,
            Observation = m.Observation,
            DateDebutMission = m.DateDebut,
            DateFinMission = m.DateFin,
            Categorie = ecole.Categorie?.Designation ?? "—",
            Adresse = ecole.Adresse,
            DateInspection = m.ValideeLe ?? m.CreatedAt,
            Recommandation = m.RecommandationPreliminaire,
            DecisionLabel = "—",
            RapportEquipeDepose = m.RapportEquipeDeposeLe != null,
            RapportSecretariatDepose = m.RapportSecretariatDeposeLe != null,
            RapportClos = m.RapportClos
        };
    }

    /// <summary>Rédige le texte de synthèse du rapport.</summary>
    private static string BuildSyntheseTexte(string sdLabel, string periodeLabel, RapportInspectionDto dto)
    {
        var parts = new List<string>
        {
            $"Pour la sous-division {sdLabel} ({periodeLabel}), {dto.EcolesCount} établissement(s) inspecté(s) " +
            $"avec {dto.FichesCount} fiche(s) validée(s) (Lu et approuvé).",
            $"Le taux de conformité des bâtiments est de {dto.TauxConformite} %."
        };
        if (dto.DecisionsCount > 0)
        {
            var types = string.Join(", ", dto.DecisionsParType.Select(d => $"{d.Label} ({d.Value})"));
            parts.Add($"{dto.DecisionsCount} décision(s) provinciale(s) enregistrée(s) : {types}.");
        }
        else
        {
            parts.Add("Aucune décision provinciale enregistrée.");
        }
        return string.Join(" ", parts);
    }
}
