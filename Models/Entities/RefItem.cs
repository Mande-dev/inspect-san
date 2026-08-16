namespace inspect_san.Models.Entities;

/// <summary>
/// Projection UI pour listes paramètres (plus de table RefItems).
/// </summary>
public class RefItem
{
    public string Id { get; set; } = "";
    public string Categorie { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public string? Libelle { get; set; }
    public bool Actif { get; set; } = true;
    /// <summary>Pour onglet équipes uniquement.</summary>
    public string? ChefControleurId { get; set; }
    public string? ChefNom { get; set; }
}
