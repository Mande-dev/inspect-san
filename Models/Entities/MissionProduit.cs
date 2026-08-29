namespace inspect_san.Models.Entities;

/// <summary>Produit constaté sur une mission — table MissionProduit.</summary>
public class MissionProduit
{
    public int Id { get; set; }
    public string NumOrdre { get; set; } = "";
    public int CodeProduit { get; set; }
    public int Quantite { get; set; }

    public Mission? Mission { get; set; }
    public Produit? Produit { get; set; }
}
