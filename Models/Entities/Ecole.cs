namespace inspect_san.Models.Entities;

/// <summary>
/// Clés métier en string (ex. "eco-001") pour rester compatible avec le mock en mémoire.
/// </summary>
public class Ecole
{
    public string Id { get; set; } = "";
    public string Denomination { get; set; } = "";
    public string RegimeId { get; set; } = "";
    public string CommuneId { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }
    public List<DocumentMeta> Documents { get; set; } = new();
    public Adresse Adresse { get; set; } = new();
    public string Statut { get; set; } = "active";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Regime? Regime { get; set; }
    public Commune? Commune { get; set; }
    public ICollection<Chef> Chefs { get; set; } = new List<Chef>();
    public ICollection<OrdreMission> OrdresMission { get; set; } = new List<OrdreMission>();
    public ICollection<FicheControle> FichesControle { get; set; } = new List<FicheControle>();
    public ICollection<Rapport> Rapports { get; set; } = new List<Rapport>();
    public ICollection<Decision> Decisions { get; set; } = new List<Decision>();
}
