namespace inspect_san.Models.DTOs;

public class SaveEcoleDto
{
    public string? Id { get; set; }
    public string Denomination { get; set; } = "";
    public string RegGes { get; set; } = "";
    public string SousDivision { get; set; } = "";
    public int CodeCategories { get; set; }
    public string IdDinacope { get; set; } = "";
    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }
    public string Adresse { get; set; } = "";
    public string? MatriculeChef { get; set; }
}

public class EcoleFilterDto
{
    public string? Q { get; set; }
    public string? Sousproved { get; set; }
    public string? Regime { get; set; }
}

public class SaveChefDto
{
    public string? Id { get; set; }
    /// <summary>Matricule saisi (PK). Obligatoire à la création ; inchangé à l'édition.</summary>
    public string Matricule { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string Telephone { get; set; } = "";
    /// <summary>Année de début d'activité (ex. 2018).</summary>
    public int? AnneeDebutActivite { get; set; }
}

public class SaveMissionDto
{
    public string? Id { get; set; }
    public string EcoleId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public DateTime? DateEmission { get; set; }
    public DateTime? FinValidite { get; set; }
    public string? Objet { get; set; }
    /// <summary>Participations : AgentId + RoleMission (au moins 1 chef_equipe).</summary>
    public List<SaveParticipationDto>? Participations { get; set; }
}

public class SaveParticipationDto
{
    public string AgentId { get; set; } = "";
    /// <summary>Code <see cref="Constants.RolesMissionCodes"/>.</summary>
    public string RoleMission { get; set; } = "";
}

public class SaveControleProduitDto
{
    public int ProduitCode { get; set; }
    public int Quantite { get; set; }
}

public class SaveControleOutilDto
{
    public int OutilCode { get; set; }
    public int Quantite { get; set; }
}

public class SaveFicheControleDto
{
    public string? Id { get; set; }
    public string MissionId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public int NombreBatiments { get; set; }
    public string EtatGeneral { get; set; } = "Satisfaisant";
    public int NombreEleves { get; set; }
    public int ToilettesFilles { get; set; }
    public int ToilettesGarcons { get; set; }
    public string? ProduitsAutres { get; set; }
    public int? ProduitsAutresQuantite { get; set; }
    public string? OutilsAutres { get; set; }
    public int? OutilsAutresQuantite { get; set; }
    public List<SaveControleProduitDto>? ControleProduits { get; set; }
    public List<SaveControleOutilDto>? ControleOutils { get; set; }
    /// <summary>Compat : premier outil si ControleOutils absent.</summary>
    public int? CodeOutil { get; set; }
    public int NbreOutil { get; set; }
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "Maintien";
    /// <summary>Montant perçu — saisi via la fiche, persisté sur <see cref="Entities.Mission.MontPer"/>.</summary>
    public decimal? MontPer { get; set; }
    public string? PhotosJson { get; set; }
}

public class SaveDecisionDto
{
    public string? Id { get; set; }
    public string FicheControleId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    /// <summary>Code <see cref="Constants.DecisionTypes"/>.</summary>
    public string TypeDecision { get; set; } = "";
}

public class SaveAgentDto
{
    /// <summary>Matricule existant (édition uniquement). Vide à la création.</summary>
    public string? Id { get; set; }
    /// <summary>Matricule (MatrAgent). Obligatoire à la création ; inchangé à l'édition.</summary>
    public string Matricule { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public bool Actif { get; set; } = true;
}

public class AgentFilterDto
{
    public string? Q { get; set; }
    public bool? Actif { get; set; }
}

public class AgentListDto
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public bool Actif { get; set; }
}
