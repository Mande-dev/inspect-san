using System.ComponentModel.DataAnnotations.Schema;

namespace inspect_san.Models.Entities;

/// <summary>Mission de contrôle (ordre + fiche fusionnés) — table Mission.</summary>
public class Mission
{
    public string NumOrdre { get; set; } = "";
    /// <summary>Clé technique pour Photos.FicheControleId et liens internes.</summary>
    public string Id { get; set; } = "";
    public DateTime? DateDebut { get; set; }
    public DateTime? DateFin { get; set; }
    public int NbreBatiment { get; set; }
    public string EtatBatiment { get; set; } = "Satisfaisant";
    public int NbrToiletteFille { get; set; }
    public int NbrToiletteGarcon { get; set; }
    public int NbrEleve { get; set; }
    public int NbreProduit { get; set; }
    public int? CodeProduit { get; set; }
    public int NbreOutil { get; set; }
    public int? CodeOutil { get; set; }
    public string? Observation { get; set; }
    /// <summary>Statut mission (<see cref="Constants.MissionStatuts"/>).</summary>
    public string? Validite { get; set; }
    public string NumAgrement { get; set; } = "";
    public decimal? MontPer { get; set; }
    /// <summary>Statut fiche (<see cref="Constants.FicheStatuts"/>).</summary>
    public string? StatutFiche { get; set; }
    public string NomEquipe { get; set; } = "";
    public string? Objet { get; set; }
    public DateTime? SigneLe { get; set; }
    public string? SignePar { get; set; }
    public string? ProduitsAutres { get; set; }
    public int? ProduitsAutresQuantite { get; set; }
    public string? OutilsAutres { get; set; }
    public int? OutilsAutresQuantite { get; set; }
    public string RecommandationPreliminaire { get; set; } = "Maintien";
    public string? ValideePar { get; set; }
    public DateTime? ValideeLe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Dépôt rapport d'équipe (contrôleurs affectés) — une seule fois.</summary>
    public DateTime? RapportEquipeDeposeLe { get; set; }
    public string? RapportEquipeDeposePar { get; set; }
    /// <summary>Dépôt rapport secrétariat — une seule fois.</summary>
    public DateTime? RapportSecretariatDeposeLe { get; set; }
    public string? RapportSecretariatDeposePar { get; set; }
    public bool RapportClos { get; set; }
    public DateTime? RapportClosLe { get; set; }
    public string? RapportClosPar { get; set; }

    public Ecole? Ecole { get; set; }
    public Produit? Produit { get; set; }
    public Outil? Outil { get; set; }
    public ICollection<Affectation> Affectations { get; set; } = new List<Affectation>();
    public ICollection<Photo> Photos { get; set; } = new List<Photo>();
    public ICollection<Decision> Decisions { get; set; } = new List<Decision>();
    public ICollection<MissionProduit> MissionProduits { get; set; } = new List<MissionProduit>();
    public ICollection<MissionOutil> MissionOutils { get; set; } = new List<MissionOutil>();

    [NotMapped]
    public string Statut
    {
        get => Validite ?? "brouillon";
        set => Validite = value;
    }

    [NotMapped]
    public string Numero
    {
        get => NumOrdre;
        set => NumOrdre = value;
    }

    [NotMapped]
    public string EcoleId
    {
        get => Ecole?.Id ?? "";
        set { /* rempli via navigation ou requête */ }
    }

    [NotMapped]
    public DateTime? DateEmission
    {
        get => DateDebut;
        set => DateDebut = value;
    }

    [NotMapped]
    public DateTime? FinValidite
    {
        get => DateFin;
        set => DateFin = value;
    }

    [NotMapped]
    public int NombreBatiments
    {
        get => NbreBatiment;
        set => NbreBatiment = value;
    }

    [NotMapped]
    public string EtatGeneral
    {
        get => EtatBatiment;
        set => EtatBatiment = value;
    }

    [NotMapped]
    public int NombreEleves
    {
        get => NbrEleve;
        set => NbrEleve = value;
    }

    [NotMapped]
    public int ToilettesFilles
    {
        get => NbrToiletteFille;
        set => NbrToiletteFille = value;
    }

    [NotMapped]
    public int ToilettesGarcons
    {
        get => NbrToiletteGarcon;
        set => NbrToiletteGarcon = value;
    }

    [NotMapped]
    public string? Observations
    {
        get => Observation;
        set => Observation = value;
    }
}
