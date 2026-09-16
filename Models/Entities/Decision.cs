namespace inspect_san.Models.Entities;

/// <summary>Décision — table Decision.</summary>
public class Decision
{
    public string NumDecision { get; set; } = "";
    /// <summary>Code constante <see cref="Constants.DecisionTypes"/>.</summary>
    public string DecisionFin { get; set; } = "";
    public string NumOrdre { get; set; } = "";
    public string NumAgrement { get; set; } = "";
    /// <summary>Date/heure UTC du 1er envoi réussi de la lettre de décision par e-mail.</summary>
    public DateTime? LdEnvoyeLe { get; set; }
    /// <summary>Adresse e-mail destinataire du 1er envoi réussi de la lettre de décision.</summary>
    public string? LdEnvoyeA { get; set; }

    public Mission? Mission { get; set; }
    public Ecole? Ecole { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string Id { get; set; } = "";

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string Numero
    {
        get => NumDecision;
        set => NumDecision = value;
    }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string TypeDecision
    {
        get => DecisionFin;
        set => DecisionFin = value;
    }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string FicheControleId { get; set; } = "";

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string EcoleId { get; set; } = "";

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string? DecidePar { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime? DecideLe { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public FicheControle? FicheControle { get; set; }
}
