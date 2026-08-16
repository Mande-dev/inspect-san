using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Interface;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class StatistiquesService : IStatistiquesService
{
    private readonly InspectSanDbContext _db;
    public StatistiquesService(InspectSanDbContext db) => _db = db;

    public async Task<StatistiquesDto> GetAsync(StatistiquesFilterDto filter)
    {
        bool InRange(DateTime? iso)
        {
            if (!iso.HasValue) return true;
            if (!string.IsNullOrEmpty(filter.DateFrom) && iso < DateTime.Parse(filter.DateFrom)) return false;
            if (!string.IsNullOrEmpty(filter.DateTo) && iso > DateTime.Parse(filter.DateTo + "T23:59:59")) return false;
            return true;
        }

        var ecolesQ = _db.Ecoles.AsNoTracking()
            .Include(e => e.Commune)
            .Include(e => e.Regime)
            .AsQueryable();
        if (!string.IsNullOrEmpty(filter.Commune))
            ecolesQ = ecolesQ.Where(e => e.Commune != null && e.Commune.Nom == filter.Commune);
        if (!string.IsNullOrEmpty(filter.Regime))
            ecolesQ = ecolesQ.Where(e => e.Regime != null && e.Regime.Nom == filter.Regime);
        if (!string.IsNullOrEmpty(filter.StatutEcole))
            ecolesQ = ecolesQ.Where(e => e.Statut == filter.StatutEcole);

        var ecoles = await ecolesQ.ToListAsync();
        var ids = ecoles.Select(e => e.Id).ToHashSet();
        var fiches = (await _db.FichesControle.AsNoTracking().ToListAsync())
            .Where(f => ids.Contains(f.EcoleId) && InRange(f.CreatedAt)).ToList();
        var decisions = (await _db.Decisions.AsNoTracking()
                .Include(d => d.TypeDecision)
                .ToListAsync())
            .Where(d => ids.Contains(d.EcoleId) && InRange(d.DecideLe ?? d.CreatedAt)).ToList();

        var counts = EtatBatiment.StatBuckets.ToDictionary(b => b, _ => 0);
        foreach (var f in fiches)
        {
            var bucket = EtatBatiment.ToStatBucket(f.SectionBatiments.EtatGeneral);
            if (bucket != null && counts.ContainsKey(bucket))
                counts[bucket]++;
        }

        // Dénominateur = fiches à état reconnu (tous les états formulaire + legacy sont mappés).
        var totalReconnu = counts.Values.Sum();
        var conformes = counts[EtatBatiment.BucketBon] + counts[EtatBatiment.BucketMoyen];
        var taux = totalReconnu == 0 ? 0 : (int)Math.Round(100.0 * conformes / totalReconnu);

        var avecMontant = fiches.Where(f =>
        {
            var m = new string((f.SectionImpact7.MontantPercu ?? "").Where(char.IsDigit).ToArray());
            return double.TryParse(m, out var v) && v > 0;
        }).ToList();
        var utilises = avecMontant.Where(f => (f.SectionImpact7.ProduitsNettoyage?.Count ?? 0) > 0).ToList();

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
                .GroupBy(d => d.TypeDecision?.Nom ?? d.TypeDecision?.Code ?? "(sans type)")
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            Impact7 =
            [
                new() { Label = "Avec montant 7%", Value = avecMontant.Count },
                new() { Label = "Dont produits déclarés", Value = utilises.Count }
            ],
            Evolution = evo
        };
    }

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

    private static string Escape(string label)
        => label.Replace(',', '_').Replace('\n', ' ');
}
