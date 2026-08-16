namespace inspect_san.Models.Entities;

public class Rapport
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    /// <summary>Ids fiches (mock + JSON EF) ; miroir relationnel via RapportFiches.</summary>
    public List<string> FicheIds { get; set; } = new();
    public string Synthese { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public DateTime? DeposeLe { get; set; }
    public string? DeposePar { get; set; }
    public DateTime? AccuseReceptionLe { get; set; }
    public string? AccusePar { get; set; }
    public DateTime? TransmisLe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Ecole? Ecole { get; set; }
    public ICollection<RapportFiche> RapportFiches { get; set; } = new List<RapportFiche>();
    public ICollection<Decision> Decisions { get; set; } = new List<Decision>();
}

public class RapportFiche
{
    public string RapportId { get; set; } = "";
    public string FicheControleId { get; set; } = "";

    public Rapport? Rapport { get; set; }
    public FicheControle? FicheControle { get; set; }
}
