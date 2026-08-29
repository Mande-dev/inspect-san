namespace inspect_san.Models.Entities;

/// <summary>Outil constaté sur une mission — table MissionOutil.</summary>
public class MissionOutil
{
    public int Id { get; set; }
    public string NumOrdre { get; set; } = "";
    public int CodeOutil { get; set; }
    public int Quantite { get; set; }

    public Mission? Mission { get; set; }
    public Outil? Outil { get; set; }
}
