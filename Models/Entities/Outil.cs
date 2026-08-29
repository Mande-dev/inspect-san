namespace inspect_san.Models.Entities;

/// <summary>Catalogue outil — table OutilUtilise.</summary>
public class Outil
{
    /// <summary>PK auto-incrémentée.</summary>
    public int CodeOutile { get; set; }
    public string LibelleOutile { get; set; } = "";

    public ICollection<Mission> Missions { get; set; } = new List<Mission>();
    public ICollection<MissionOutil> MissionOutils { get; set; } = new List<MissionOutil>();
}
