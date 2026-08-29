namespace inspect_san.Models.Entities;

/// <summary>Agent — table Agents.</summary>
public class Agent
{
    public string MatrAgent { get; set; } = "";
    public string NomAgent { get; set; } = "";
    public string? TelAgent { get; set; }
    public bool Actif { get; set; } = true;

    public ICollection<Affectation> Affectations { get; set; } = new List<Affectation>();

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string Id
    {
        get => MatrAgent;
        set => MatrAgent = value;
    }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string NomComplet
    {
        get => NomAgent;
        set => NomAgent = value;
    }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string? Telephone
    {
        get => TelAgent;
        set => TelAgent = value;
    }

    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
