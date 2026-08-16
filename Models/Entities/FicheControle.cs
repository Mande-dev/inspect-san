namespace inspect_san.Models.Entities;

public class FicheControle
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string OrdreMissionId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? ChefId { get; set; }
    public string Statut { get; set; } = "brouillon";
    public SectionBatiments SectionBatiments { get; set; } = new();
    public SectionImpact7 SectionImpact7 { get; set; } = new();
    public string ProduitsAutres { get; set; } = "";
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "Maintien";
    public List<PhotoMeta> Photos { get; set; } = new();
    public string? ValideePar { get; set; }
    public DateTime? ValideeLe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public OrdreMission? OrdreMission { get; set; }
    public Ecole? Ecole { get; set; }
    public Chef? Chef { get; set; }
    public ICollection<RapportFiche> RapportFiches { get; set; } = new List<RapportFiche>();
}
