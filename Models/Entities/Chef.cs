namespace inspect_san.Models.Entities;

/// <summary>Chef d'établissement — table ChefEtablissement (PK Matricule).</summary>
public class Chef
{
    /// <summary>Clé primaire (matricule saisi).</summary>
    public string Matricule { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string Telephone { get; set; } = "";
    /// <summary>Adresse e-mail de contact du chef d'établissement.</summary>
    public string? Email { get; set; }
    /// <summary>Année de début d'activité (ex. 2018).</summary>
    public int? AnneeDebutActivite { get; set; }

    public ICollection<Ecole> Ecoles { get; set; } = new List<Ecole>();

    /// <summary>Alias UI / formulaires (même valeur que <see cref="Matricule"/>).</summary>
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string Id
    {
        get => Matricule;
        set => Matricule = value;
    }
}
