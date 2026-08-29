namespace inspect_san.Models.Entities;

/// <summary>Photo de constat liée à une mission (colonne FicheControleId conservée).</summary>
public class Photo
{
    public int Id { get; set; }
    public string FicheControleId { get; set; } = "";
    public string Nom { get; set; } = "";
    public string Legende { get; set; } = "";
    public string Url { get; set; } = "";

    public Mission? Mission { get; set; }
}
