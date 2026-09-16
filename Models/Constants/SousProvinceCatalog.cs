namespace inspect_san.Models.Constants;

/// <summary>
/// Catalogue seed / migration des sous-provinces (la BDD est la source de vérité à l'exécution).
/// </summary>
public static class SousProvinceCatalog
{
    /// <summary>Ligne catalogue : code officiel, libellé et code legacy.</summary>
    public sealed record Row(string Code, string Libelle, string LegacyCode);

    public static readonly IReadOnlyList<Row> Rows =
    [
        new("SP001", "Kinsenso 1", "kinsenso_1"),
        new("SP002", "Kinsenso 2", "kinsenso_2"),
        new("SP003", "Lemba 1", "lemba_1"),
        new("SP004", "Lemba 2", "lemba_2"),
        new("SP005", "Limete 1", "limete_1"),
        new("SP006", "Limete 2", "limete_2"),
        new("SP007", "Limete 3", "limete_3"),
        new("SP008", "Matete 1", "matete_1"),
        new("SP009", "Matete 2", "matete_2"),
        new("SP010", "Ngaba", "ngaba"),
    ];

    /// <summary>Résout un code SP00x, un legacy ou un libellé vers le code officiel.</summary>
    public static string? CodeFromLegacyOrCode(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var trimmed = value.Trim();
        var byLegacy = Rows.FirstOrDefault(r =>
            string.Equals(r.LegacyCode, trimmed, StringComparison.OrdinalIgnoreCase));
        if (byLegacy != null) return byLegacy.Code;
        var byCode = Rows.FirstOrDefault(r =>
            string.Equals(r.Code, trimmed, StringComparison.OrdinalIgnoreCase));
        if (byCode != null) return byCode.Code;
        var byLabel = Rows.FirstOrDefault(r =>
            string.Equals(r.Libelle, trimmed, StringComparison.OrdinalIgnoreCase));
        if (byLabel != null) return byLabel.Code;
        // Codes SP créés hors catalogue seed (gestion Paramètres)
        if (trimmed.Length >= 3
            && trimmed.StartsWith("SP", StringComparison.OrdinalIgnoreCase)
            && trimmed.Skip(2).All(char.IsDigit))
            return trimmed.ToUpperInvariant();
        return null;
    }

    /// <summary>Libellé pour un code SP00x ou legacy.</summary>
    public static string LabelOf(string? code)
    {
        if (string.IsNullOrWhiteSpace(code)) return "";
        var row = Rows.FirstOrDefault(r =>
            string.Equals(r.Code, code, StringComparison.OrdinalIgnoreCase)
            || string.Equals(r.LegacyCode, code, StringComparison.OrdinalIgnoreCase));
        return row?.Libelle ?? code;
    }
}
