namespace inspect_san.Models.DTOs;

public class ApiResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public bool SuggestDeactivate { get; set; }
    public object? Data { get; set; }
    public List<string>? Errors { get; set; }

    public static ApiResultDto Ok(string message, object? data = null) =>
        new() { Success = true, Message = message, Data = data };

    public static ApiResultDto Fail(string message, bool suggestDeactivate = false, List<string>? errors = null) =>
        new() { Success = false, Message = message, SuggestDeactivate = suggestDeactivate, Errors = errors };
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
    public int RapportsDeposes { get; set; }
    public int DecisionsEnAttente { get; set; }
    public List<ChartPointDto> EcolesByRegime { get; set; } = new();
    public List<ChartPointDto> DecisionsByType { get; set; } = new();
    public List<ChartPointDto> ControlesParMois { get; set; } = new();
    public List<JournalListDto> RecentJournal { get; set; } = new();
}

public class EcoleListDto
{
    public string Id { get; set; } = "";
    public string Denomination { get; set; } = "";
    public string Regime { get; set; } = "";
    public string RegimeId { get; set; } = "";
    public string IdDinacope { get; set; } = "";
    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }
    public string Commune { get; set; } = "";
    public string CommuneId { get; set; } = "";
    public string Quartier { get; set; } = "";
    public string Avenue { get; set; } = "";
    public string Numero { get; set; } = "";
    public string Statut { get; set; } = "";
    public List<DocumentMetaDto> Documents { get; set; } = new();
}

public class DocumentMetaDto
{
    public string Nom { get; set; } = "";
    public string Taille { get; set; } = "";
    public string Url { get; set; } = "";
    public DateTime Date { get; set; }
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
    public string IdDinacope { get; set; } = "";
    public string Telephone { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public int? AncienneteEnseignement { get; set; }
    public int? AncienneteChef { get; set; }
    public int? AncienneteEcole { get; set; }
}

public class UtilisateurListDto
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string Role { get; set; } = "";
    public string? Equipe { get; set; }
    public string? EquipeId { get; set; }
    public string? ControleurId { get; set; }
    public string Statut { get; set; } = "";
    public string Identifiant { get; set; } = "";
    public string? Telephone { get; set; }
    public string? EcoleId { get; set; }
}

public class SaveUtilisateurDto
{
    public string? Id { get; set; }
    public string Nom { get; set; } = "";
    /// <summary>Adresse e-mail (sert aussi de UserName Identity).</summary>
    public string Contact { get; set; } = "";
    public string Role { get; set; } = "";
    public string? Equipe { get; set; }
    public string? EquipeId { get; set; }
    /// <summary>Chef d’équipe (Controleur) pour le rôle Contrôleur.</summary>
    public string? ControleurId { get; set; }
    public string Statut { get; set; } = "actif";
    /// <summary>Conservé pour compat ; ignoré si Contact (e-mail) est fourni.</summary>
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
    public string? Equipe { get; set; }
    public string? EcoleId { get; set; }
    public string? EcoleNom { get; set; }
    public string Statut { get; set; } = "";
}

/// <summary>Chef d’équipe sans compte Identity (pour select Utilisateurs).</summary>
public class ChefEquipeSansCompteDto
{
    public string ControleurId { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string EquipeId { get; set; } = "";
    public string EquipeNom { get; set; } = "";
}

public class OrdreFilterDto
{
    public string? Q { get; set; }
    public string? Statut { get; set; }
}

public class OrdreListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string EquipeId { get; set; } = "";
    public string? EquipeNom { get; set; }
    public string Statut { get; set; } = "";
    public DateTime? DateEmission { get; set; }
    public DateTime? DebutValidite { get; set; }
    public DateTime? FinValidite { get; set; }
    public string? Objet { get; set; }
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
    public string OrdreMissionId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string Statut { get; set; } = "";
    public string EtatGeneral { get; set; } = "";
    public string RecommandationPreliminaire { get; set; } = "";
}

public class RapportListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public List<string> FicheIds { get; set; } = new();
    public string Synthese { get; set; } = "";
    public string Statut { get; set; } = "";
    /// <summary>Équipe déduite des fiches → OM (informatif).</summary>
    public string? EquipeId { get; set; }
    /// <summary>Brouillon déposable si aucune fiche déjà consommée par un autre dépôt.</summary>
    public bool PeutDeposer { get; set; }
}

public class AccuseFilterDto
{
    public string? Q { get; set; }
    public string? Statut { get; set; }
}

public class AccuseListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string Statut { get; set; } = "";
    public DateTime? DeposeLe { get; set; }
    public DateTime? AccuseReceptionLe { get; set; }
}

public class DecisionListDto
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string RapportId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string? EcoleNom { get; set; }
    public string Type { get; set; } = "";
    public string TypeDecisionId { get; set; } = "";
    public string? DelaiExecution { get; set; }
    public string StatutExecution { get; set; } = "";
    public string? Commentaire { get; set; }
}

public class StatistiquesFilterDto
{
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public string? Commune { get; set; }
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
    public List<ChartPointDto> Impact7 { get; set; } = new();
    public List<ChartPointDto> Evolution { get; set; } = new();
}

public class SaveRefItemDto
{
    public string? Id { get; set; }
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public string? Libelle { get; set; }
    public bool Actif { get; set; } = true;
}

/// <summary>
/// DTO dédié équipes (préféré à SaveRefItemDto).
/// Chef optionnel à la création ; peut être désigné plus tard via ChefControleurId.
/// </summary>
public class SaveEquipeDto
{
    public string? Id { get; set; }
    public string Nom { get; set; } = "";
    public bool Actif { get; set; } = true;
    /// <summary>Contrôleur existant à désigner chef (optionnel).</summary>
    public string? ChefControleurId { get; set; }
}

public class RefItemDto
{
    public string Id { get; set; } = "";
    public string Categorie { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public string? Libelle { get; set; }
    public bool Actif { get; set; }
    public string? ChefControleurId { get; set; }
    public string? ChefNom { get; set; }
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
