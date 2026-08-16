namespace inspect_san.Models.DTOs;

public class SaveEcoleDto
{
    public string? Id { get; set; }
    public string Denomination { get; set; } = "";
    public string RegimeId { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }
    public string CommuneId { get; set; } = "";
    public string Quartier { get; set; } = "";
    public string Avenue { get; set; } = "";
    public string Numero { get; set; } = "";
    public string Statut { get; set; } = "active";
    public string? DocumentsJson { get; set; }
}

public class EcoleFilterDto
{
    public string? Q { get; set; }
    public string? Commune { get; set; }
    public string? Regime { get; set; }
    public string? Statut { get; set; }
}

public class SaveChefDto
{
    public string? Id { get; set; }
    public string NomComplet { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string Telephone { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public int? AncienneteEnseignement { get; set; }
    public int? AncienneteChef { get; set; }
    public int? AncienneteEcole { get; set; }
}

public class SaveOrdreMissionDto
{
    public string? Id { get; set; }
    public string EcoleId { get; set; } = "";
    public string EquipeId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public DateTime? DateEmission { get; set; }
    public DateTime? DebutValidite { get; set; }
    public DateTime? FinValidite { get; set; }
    public string? Objet { get; set; }
}

public class SaveFicheControleDto
{
    public string? Id { get; set; }
    public string OrdreMissionId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public int NombreBatiments { get; set; }
    public string EtatGeneral { get; set; } = "Satisfaisant";
    public int NombreEleves { get; set; }
    public string ToilettesFilles { get; set; } = "";
    public string ToilettesGarcons { get; set; } = "";
    public string MontantPercu { get; set; } = "";
    public string[]? ProduitsNettoyage { get; set; }
    public string ProduitsAutres { get; set; } = "";
    public string Quantite { get; set; } = "";
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "Maintien";
    public string? PhotosJson { get; set; }
}

public class SaveRapportDto
{
    public string? Id { get; set; }
    public string? EcoleId { get; set; }
    public string[]? FicheIds { get; set; }
    public string Synthese { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
}

public class SaveDecisionDto
{
    public string? Id { get; set; }
    public string RapportId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string TypeDecisionId { get; set; } = "";
    public string? DelaiExecution { get; set; }
    public string StatutExecution { get; set; } = "en_attente";
    public string? Motif { get; set; }
    public string? Commentaire { get; set; }
}

public class SaveControleurDto
{
    public string? Id { get; set; }
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public string EquipeId { get; set; } = "";
    public bool Actif { get; set; } = true;
}

public class ControleurFilterDto
{
    public string? Q { get; set; }
    public string? EquipeId { get; set; }
}

public class ControleurListDto
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public string EquipeId { get; set; } = "";
    public string? EquipeNom { get; set; }
    public bool Actif { get; set; }
    public bool EstChefEquipe { get; set; }
}
