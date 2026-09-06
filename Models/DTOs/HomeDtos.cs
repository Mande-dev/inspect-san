namespace inspect_san.Models.DTOs;

public class ApiResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    /// <summary>Titre du modal (ex. suppression refusée).</summary>
    public string? Title { get; set; }
    /// <summary>Explication administrative détaillée (affichée en modal).</summary>
    public string? Detail { get; set; }
    public bool SuggestDeactivate { get; set; }
    /// <summary>Indique une action administrative bloquée (suppression illogique, etc.).</summary>
    public bool Blocked { get; set; }
    public object? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResultDto Ok(string message, object? data = null) =>
        new() { Success = true, Message = message, Data = data };

    public static ApiResultDto Fail(string message, bool suggestDeactivate = false, List<string>? errors = null) =>
        new() { Success = false, Message = message, SuggestDeactivate = suggestDeactivate, Errors = errors };

    /// <summary>Échec métier avec explication administrative (modal, non technique).</summary>
    public static ApiResultDto FailBlocked(
        string title,
        string message,
        string detail,
        bool suggestDeactivate = false) =>
        new()
        {
            Success = false,
            Blocked = true,
            Title = title,
            Message = message,
            Detail = detail,
            SuggestDeactivate = suggestDeactivate
        };
}

public class ChartPointDto
{
    public string Label { get; set; } = "";
    public int Value { get; set; }
}

public class DashboardDto
{
    public string Role { get; set; } = "";
    public string RoleTip { get; set; } = "";
    public int EcolesCount { get; set; }
    public int MissionsEnCours { get; set; }
    public int FichesEnAttente { get; set; }
    public int DecisionsEnAttente { get; set; }
    public List<ChartPointDto> EcolesByRegime { get; set; } = new();
    public List<ChartPointDto> DecisionsByType { get; set; } = new();
    public List<ChartPointDto> ControlesParMois { get; set; } = new();
    public List<JournalListDto> RecentJournal { get; set; } = new();
}

public class EcoleListDto
{
    public string Id { get; set; } = "";
    public string NumAgrement { get; set; } = "";
    public string Denomination { get; set; } = "";
    public string Regime { get; set; } = "";
    public string RegGes { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumNotification { get; set; }
    public string Sousproved { get; set; } = "";
    public string SousDivision { get; set; } = "";
    public int CodeCategories { get; set; }
    public string Categorie { get; set; } = "";
    public string Adresse { get; set; } = "";
    public string? MatriculeChef { get; set; }
}

public class ChefFilterDto
{
    public string? Q { get; set; }
    public string? EcoleId { get; set; }
}

public class ChefListDto
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string Telephone { get; set; } = "";
    public string? EcoleNom { get; set; }
    public int? AnneeDebutActivite { get; set; }
}

public class UtilisateurListDto
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string Role { get; set; } = "";
    public string? AgentId { get; set; }
    public string? AgentNom { get; set; }
    public string Statut { get; set; } = "";
    public string Identifiant { get; set; } = "";
    public string? Telephone { get; set; }
    public string? EcoleId { get; set; }
}

public class SaveUtilisateurDto
{
    public string? Id { get; set; }
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string Role { get; set; } = "";
    public string? AgentId { get; set; }
    public string Statut { get; set; } = "actif";
    public string Identifiant { get; set; } = "";
    public string? MotDePasse { get; set; }
    public string? ConfirmationMotDePasse { get; set; }
    public string? Telephone { get; set; }
    public string? EcoleId { get; set; }
}

public class UpdateProfilDto
{
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string? Telephone { get; set; }
    public string? MotDePasseActuel { get; set; }
    public string? NouveauMotDePasse { get; set; }
    public string? ConfirmationMotDePasse { get; set; }
}

public class ProfilDto
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string? Telephone { get; set; }
    public string Role { get; set; } = "";
    public string? AgentId { get; set; }
    public string? AgentNom { get; set; }
    public string? EcoleId { get; set; }
    public string? EcoleNom { get; set; }
    public string Statut { get; set; } = "";
}

public class AgentSansCompteDto
{
    public string AgentId { get; set; } = "";
    public string NomComplet { get; set; } = "";
}

public class MissionFilterDto
{
    public string? Q { get; set; }
    public string? Statut { get; set; }
}

public class MissionListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string NomEquipe { get; set; } = "";
    public string Statut { get; set; } = "";
    public DateTime? DateEmission { get; set; }
    public DateTime? FinValidite { get; set; }
    public DateTime? SigneLe { get; set; }
    public string? Objet { get; set; }
    public decimal? MontPer { get; set; }
    public List<ParticipationListDto> Participations { get; set; } = new();
    /// <summary>Droit d'écriture pour l'utilisateur courant (rempli côté API/UI si besoin).</summary>
    public bool CanWrite { get; set; }
    public bool CanDeleguer { get; set; }
}

public class ParticipationListDto
{
    public string Id { get; set; } = "";
    public string AgentId { get; set; } = "";
    public string? AgentNom { get; set; }
    public string? AgentTelephone { get; set; }
    public string RoleMission { get; set; } = "";
    public string? RoleNom { get; set; }
    public bool EcritureDeleguee { get; set; }
}

public class FicheFilterDto
{
    public string? Q { get; set; }
    public string? Statut { get; set; }
}

public class FicheListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string MissionId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string? ChefNom { get; set; }
    public string Statut { get; set; } = "";
    public string EtatGeneral { get; set; } = "";
    public int NombreBatiments { get; set; }
    public int NombreEleves { get; set; }
    public int ToilettesFilles { get; set; }
    public int ToilettesGarcons { get; set; }
    public string? ProduitsAutres { get; set; }
    public int? ProduitsAutresQuantite { get; set; }
    public string? OutilsAutres { get; set; }
    public int? OutilsAutresQuantite { get; set; }
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "";
    /// <summary>Montant perçu (Mission.MontPer).</summary>
    public decimal? MontPer { get; set; }
    public List<ControleProduitListDto> ControleProduits { get; set; } = new();
    public List<ControleOutilListDto> ControleOutils { get; set; } = new();
    public List<FichePhotoListDto> Photos { get; set; } = new();
}

public class ControleProduitListDto
{
    public int ProduitCode { get; set; }
    public string? ProduitNom { get; set; }
    public int Quantite { get; set; }
}

public class ControleOutilListDto
{
    public int OutilCode { get; set; }
    public string? OutilNom { get; set; }
    public int Quantite { get; set; }
}

public class FichePhotoListDto
{
    public string Nom { get; set; } = "";
    public string Legende { get; set; } = "";
    public string Url { get; set; } = "";
    public string? NumOrdre { get; set; }
    public string? MissionId { get; set; }
}

public class DecisionListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string FicheControleId { get; set; } = "";
    public string? FicheNumero { get; set; }
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string? ChefNom { get; set; }
    public string Type { get; set; } = "";
    public string TypeDecision { get; set; } = "";
}

public class StatistiquesFilterDto
{
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public string? Sousproved { get; set; }
    public string? Regime { get; set; }
    public string? StatutEcole { get; set; }
}

public class StatistiquesDto
{
    public int EcolesCount { get; set; }
    public int FichesCount { get; set; }
    public int TauxConformite { get; set; }
    public int DecisionsCount { get; set; }
    public List<ChartPointDto> Conformite { get; set; } = new();
    public List<ChartPointDto> DecisionsParType { get; set; } = new();
    /// <summary>Fiches avec produits déclarés (référentiel et/ou autres).</summary>
    public List<ChartPointDto> ProduitsDeclares { get; set; } = new();
    public List<ChartPointDto> Evolution { get; set; } = new();
}

public class RapportInspectionFilterDto
{
    /// <summary>Code SP00x ou libellé de sous-province.</summary>
    public string? Sousproved { get; set; }
}

public class RapportInspectionLigneDto
{
    public string NumOrdre { get; set; } = "";
    public string MissionId { get; set; } = "";
    public string EcoleNom { get; set; } = "";
    public string FonctionControleur { get; set; } = "";
    public string NumAgrement { get; set; } = "";
    public string NomAgent { get; set; } = "";
    public string EtatBatiment { get; set; } = "";
    public int NombreBatiments { get; set; }
    public int ToilettesFilles { get; set; }
    public int ToilettesGarcons { get; set; }
    public int NombreEleves { get; set; }
    public string DesignationProduit { get; set; } = "";
    public string DesignationOutil { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string ChefNom { get; set; } = "";
    public string Regime { get; set; } = "";
    public decimal? MontPer { get; set; }
    public string? Observation { get; set; }
    public DateTime? DateDebutMission { get; set; }
    public DateTime? DateFinMission { get; set; }

    // Compat / UI aperçu écran
    public string Categorie { get; set; } = "";
    public string Adresse { get; set; } = "";
    public DateTime? DateInspection { get; set; }
    public string Recommandation { get; set; } = "";
    public string DecisionLabel { get; set; } = "";

    public bool RapportEquipeDepose { get; set; }
    public bool RapportSecretariatDepose { get; set; }
    public bool RapportClos { get; set; }
}

public class RapportInspectionDto
{
    public string SousDivisionCode { get; set; } = "";
    public string SousDivisionLabel { get; set; } = "";
    public string PeriodeLabel { get; set; } = "";
    public int EcolesCount { get; set; }
    public int FichesCount { get; set; }
    public int TauxConformite { get; set; }
    public int DecisionsCount { get; set; }
    public string RegGesResume { get; set; } = "";
    public decimal MontantPercuTotal { get; set; }
    public string ObservationResume { get; set; } = "";
    public DateTime? DateDebutMissionMin { get; set; }
    public DateTime? DateFinMissionMax { get; set; }
    public int TotaleSousDivision { get; set; }
    public List<ChartPointDto> Conformite { get; set; } = new();
    public List<ChartPointDto> DecisionsParType { get; set; } = new();
    public string SyntheseTexte { get; set; } = "";
    public List<RapportInspectionLigneDto> Lignes { get; set; } = new();
}

public class RapportInspectionResponseDto
{
    public string PeriodeLabel { get; set; } = "";
    public bool ToutesSousDivisions { get; set; }
    public int TotalGenerale { get; set; }
    public decimal MontantPercuGeneral { get; set; }
    public List<RapportInspectionDto> Sections { get; set; } = new();

    public bool CanDeposerEquipe { get; set; }
    public bool CanDeposerSecretariat { get; set; }
    public bool CanCloturer { get; set; }
    public int MissionsEligiblesCount { get; set; }
    public int EquipeDeposeCount { get; set; }
    public int SecretariatDeposeCount { get; set; }
    public int ClosCount { get; set; }
}

public class SousDivisionCodeRequest
{
    public string SousDivisionCode { get; set; } = "";
}

public class SaveRefItemDto
{
    /// <summary>Code auto-incrémenté (0 = création).</summary>
    public int Code { get; set; }
    public string Nom { get; set; } = "";
    public string? Libelle { get; set; }
}

public class RefItemDto
{
    public int Code { get; set; }
    public string Categorie { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Libelle { get; set; }
}

public class JournalFilterDto
{
    public string? Q { get; set; }
    public string? UserId { get; set; }
    public string? Module { get; set; }
}

public class JournalListDto
{
    public string Id { get; set; } = "";
    public string UtilisateurId { get; set; } = "";
    public string? UtilisateurNom { get; set; }
    public string Module { get; set; } = "";
    public string Action { get; set; } = "";
    public string Detail { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class NotificationListDto
{
    public string Id { get; set; } = "";
    public string Titre { get; set; } = "";
    public string Message { get; set; } = "";
    public bool Lu { get; set; }
    public DateTime CreatedAt { get; set; }
}
