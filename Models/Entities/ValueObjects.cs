namespace inspect_san.Models.Entities;

/// <summary>Value object — adresse d'établissement (owned par Ecole). Commune via Ecole.CommuneId.</summary>
public class Adresse
{
    public string Quartier { get; set; } = "";
    public string Avenue { get; set; } = "";
    public string Numero { get; set; } = "";
}

/// <summary>Métadonnées document (owned collection).</summary>
public class DocumentMeta
{
    public string Nom { get; set; } = "";
    public string Taille { get; set; } = "";
    public string Url { get; set; } = "";
    public DateTime Date { get; set; } = DateTime.UtcNow;
}

/// <summary>Métadonnées photo de constat (owned collection).</summary>
public class PhotoMeta
{
    public string Nom { get; set; } = "";
    public string Legende { get; set; } = "";
    public string Url { get; set; } = "";
}

public class SectionBatiments
{
    public int NombreBatiments { get; set; }
    public string EtatGeneral { get; set; } = "Satisfaisant";
    public int NombreEleves { get; set; }
    public string ToilettesFilles { get; set; } = "";
    public string ToilettesGarcons { get; set; } = "";
}

public class SectionImpact7
{
    public string MontantPercu { get; set; } = "";
    public List<string> ProduitsNettoyage { get; set; } = new();
    public string Quantite { get; set; } = "";
}
