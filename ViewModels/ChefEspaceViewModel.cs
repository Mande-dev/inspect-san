namespace inspect_san.ViewModels;

/// <summary>Espace unique du Chef d’établissement (pas de graphe EF).</summary>
public class ChefEspaceViewModel
{
    public string? EcoleId { get; set; }
    public bool HasEcoleId { get; set; }
    public string? WarningMessage { get; set; }
    public bool CanValiderFiche { get; set; }

    public ChefProfilVm? Profil { get; set; }
    public EcoleResumeVm? Ecole { get; set; }
    public List<FicheResumeVm> Fiches { get; set; } = new();
    public List<DecisionResumeVm> Decisions { get; set; } = new();

    public int FichesBrouillonCount { get; set; }
    public int FichesValideesCount { get; set; }
    public int DecisionsEnAttenteCount { get; set; }
}

public class ChefProfilVm
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public string? IdDinacope { get; set; }
    public int? AncienneteEnseignement { get; set; }
    public int? AncienneteChef { get; set; }
    public int? AncienneteEcole { get; set; }
}

public class EcoleResumeVm
{
    public string Id { get; set; } = "";
    public string Denomination { get; set; } = "";
    public string? Regime { get; set; }
    public string? Commune { get; set; }
    public string? Quartier { get; set; }
    public string? Avenue { get; set; }
    public string? Numero { get; set; }
    public string Statut { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }
}

public class FicheResumeVm
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string Statut { get; set; } = "";
    public string? EtatGeneral { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? ValideeLe { get; set; }
    public bool PeutValider { get; set; }

    public string? OrdreMissionNumero { get; set; }
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "";
    public string ProduitsAutres { get; set; } = "";

    public int NombreBatiments { get; set; }
    public int NombreEleves { get; set; }
    public string ToilettesFilles { get; set; } = "";
    public string ToilettesGarcons { get; set; } = "";

    public string MontantPercu { get; set; } = "";
    public string Quantite { get; set; } = "";
    public List<string> ProduitsNettoyage { get; set; } = new();

    public List<FichePhotoVm> Photos { get; set; } = new();
}

public class FichePhotoVm
{
    public string Nom { get; set; } = "";
    public string Legende { get; set; } = "";
    public string Url { get; set; } = "";
}

public class DecisionResumeVm
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string? Type { get; set; }
    public string StatutExecution { get; set; } = "";
    public DateTime? DecideLe { get; set; }
    public string? DelaiExecution { get; set; }
    public string? Motif { get; set; }
    public string? Commentaire { get; set; }
    public string? RapportNumero { get; set; }
}
