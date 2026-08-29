namespace inspect_san.Models.Entities;

/// <summary>
/// Projection UI pour listes paramètres / constantes (pas de table dédiée).
/// </summary>
public class RefItem
{
    /// <summary>Code affiché / value des listes (int auto-inc en string pour les référentiels BDD).</summary>
    public string Code { get; set; } = "";
    public string Categorie { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Libelle { get; set; }
    public bool Actif { get; set; } = true;
}
