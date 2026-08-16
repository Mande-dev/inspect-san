namespace inspect_san.Models.Entities;

public class OrdreMission
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string EquipeId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public DateTime? DateEmission { get; set; }
    public DateTime? DebutValidite { get; set; }
    public DateTime? FinValidite { get; set; }
    public DateTime? DateMission { get; set; }
    public DateTime? SigneLe { get; set; }
    public string? SignePar { get; set; }
    public string? Objet { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Ecole? Ecole { get; set; }
    public Equipe? Equipe { get; set; }
    public ICollection<FicheControle> FichesControle { get; set; } = new List<FicheControle>();
}
