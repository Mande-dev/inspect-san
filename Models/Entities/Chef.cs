namespace inspect_san.Models.Entities;

public class Chef
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string Telephone { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public int? AncienneteEnseignement { get; set; }
    public int? AncienneteChef { get; set; }
    public int? AncienneteEcole { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Ecole? Ecole { get; set; }
    public ICollection<FicheControle> FichesControle { get; set; } = new List<FicheControle>();
}
