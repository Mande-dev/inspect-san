namespace inspect_san.Models.Entities;

/// <summary>Catégorie d'établissement — table Categories.</summary>
public class Categorie
{
    /// <summary>PK auto-incrémentée.</summary>
    public int CodeCategories { get; set; }
    public string Designation { get; set; } = "";

    public ICollection<Ecole> Ecoles { get; set; } = new List<Ecole>();
}
