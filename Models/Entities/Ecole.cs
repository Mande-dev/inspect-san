namespace inspect_san.Models.Entities;

/// <summary>Établissement scolaire — table Etablissement.</summary>
public class Ecole
{
    /// <summary>Clé métier (PK).</summary>
    public string NumAgrement { get; set; } = "";
    /// <summary>Clé technique pour AspNetUsers.EcoleId et liens internes.</summary>
    public string Id { get; set; } = "";
    public string Denomination { get; set; } = "";
    /// <summary>Code constante <see cref="Constants.RegGes"/>.</summary>
    public string RegGes { get; set; } = "";
    /// <summary>FK → SousProvince.Code.</summary>
    public string SousDivision { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumNotification { get; set; }
    public string Adresse { get; set; } = "";
    /// <summary>FK → ChefEtablissement.Matricule.</summary>
    public string? MatriculeChef { get; set; }
    public int CodeCategories { get; set; }

    public Categorie? Categorie { get; set; }
    public Chef? ChefEtablissement { get; set; }
    public SousProvince? SousProvince { get; set; }
    public ICollection<Mission> Missions { get; set; } = new List<Mission>();
    public ICollection<Decision> Decisions { get; set; } = new List<Decision>();
}
