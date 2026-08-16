namespace inspect_san.Models.Entities;

public class Decision
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string RapportId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string TypeDecisionId { get; set; } = "";
    public string? DelaiExecution { get; set; }
    public string StatutExecution { get; set; } = "en_attente";
    public string? Motif { get; set; }
    public string? Commentaire { get; set; }
    public string? DecidePar { get; set; }
    public DateTime? DecideLe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Rapport? Rapport { get; set; }
    public Ecole? Ecole { get; set; }
    public TypeDecision? TypeDecision { get; set; }
}
