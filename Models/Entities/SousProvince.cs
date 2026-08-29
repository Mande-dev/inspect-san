namespace inspect_san.Models.Entities;

/// <summary>Sous-province / sous-division géographique (table référentielle).</summary>
public class SousProvince
{
    /// <summary>Code officiel SP001, SP002, …</summary>
    public string Code { get; set; } = "";
    public string Libelle { get; set; } = "";
}
