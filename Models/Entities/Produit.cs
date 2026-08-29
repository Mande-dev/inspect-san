namespace inspect_san.Models.Entities;

/// <summary>Catalogue produit — table ProduitUtilise.</summary>
public class Produit
{
    /// <summary>PK auto-incrémentée.</summary>
    public int CodeProduit { get; set; }
    public string LibeleProduit { get; set; } = "";

    public ICollection<Mission> Missions { get; set; } = new List<Mission>();
    public ICollection<MissionProduit> MissionProduits { get; set; } = new List<MissionProduit>();
}
