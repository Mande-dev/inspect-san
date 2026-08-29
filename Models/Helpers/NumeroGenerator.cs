using System.Globalization;
using System.Text.RegularExpressions;
using inspect_san.Models.Data;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Models.Helpers;

/// <summary>Génère des numéros métier séquentiels du type <c>OM-2026-001</c>.</summary>
public static partial class NumeroGenerator
{
    /// <summary>Format : PREFIX-ANNÉE-SEQ (ex. OM-2026-001).</summary>
    public static string Format(string prefix, int year, int sequence, int digits = 3)
        => $"{prefix.Trim().ToUpperInvariant()}-{year}-{sequence.ToString($"D{digits}", CultureInfo.InvariantCulture)}";

    /// <summary>
    /// Prochain numéro de mission pour l’année donnée (UTC par défaut) :
    /// <c>OM-2026-001</c>, <c>OM-2026-002</c>, … (préfixe OM pour compatibilité).
    /// </summary>
    public static Task<string> NextMissionAsync(
        InspectSanDbContext db,
        DateTime? date = null,
        CancellationToken ct = default)
        => NextAsync(db.Missions.AsNoTracking().Select(m => m.NumOrdre), "OM", date, digits: 3, ct);

    /// <summary>
    /// Calcule le prochain numéro <c>{PREFIX}-{année}-{seq}</c> à partir des numéros existants
    /// du même préfixe/année (ignore les autres formats éventuels).
    /// </summary>
    public static async Task<string> NextAsync(
        IQueryable<string> existingNumeros,
        string prefix,
        DateTime? date = null,
        int digits = 3,
        CancellationToken ct = default)
    {
        var year = (date ?? DateTime.UtcNow).Year;
        var prefixUpper = prefix.Trim().ToUpperInvariant();
        var yearPrefix = $"{prefixUpper}-{year}-";

        var candidates = await existingNumeros
            .Where(n => n != null && n.StartsWith(yearPrefix))
            .ToListAsync(ct);

        var maxSeq = 0;
        var pattern = SequentielRegex();
        foreach (var numero in candidates)
        {
            var m = pattern.Match(numero);
            if (!m.Success) continue;
            if (!string.Equals(m.Groups[1].Value, prefixUpper, StringComparison.OrdinalIgnoreCase))
                continue;
            if (!int.TryParse(m.Groups[2].Value, NumberStyles.None, CultureInfo.InvariantCulture, out var y) || y != year)
                continue;
            if (!int.TryParse(m.Groups[3].Value, NumberStyles.None, CultureInfo.InvariantCulture, out var seq))
                continue;
            if (seq > maxSeq) maxSeq = seq;
        }

        return Format(prefixUpper, year, maxSeq + 1, digits);
    }

    [GeneratedRegex(@"^([A-Za-z]+)-(\d{4})-(\d+)$", RegexOptions.CultureInvariant)]
    private static partial Regex SequentielRegex();
}
