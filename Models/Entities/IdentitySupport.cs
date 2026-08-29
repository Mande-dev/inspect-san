namespace inspect_san.Models.Entities;

/// <summary>
/// Projection UI / compatibilité vues. Source de vérité : ApplicationUser (Identity).
/// MotDePasse n'est jamais peuplé depuis Identity.
/// </summary>
public class Utilisateur
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string Contact { get; set; } = "";
    public string Role { get; set; } = "";
    public string Statut { get; set; } = "actif";
    public string Identifiant { get; set; } = "";
    public string MotDePasse { get; set; } = "";
    public string? ConfirmationMotDePasse { get; set; }
    public string? Telephone { get; set; }
    public string? EcoleId { get; set; }
    public string? AgentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class NotificationItem
{
    public string Id { get; set; } = "";
    public string Titre { get; set; } = "";
    public string Message { get; set; } = "";
    public bool Lu { get; set; }
    public string? UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class JournalEntry
{
    public string Id { get; set; } = "";
    public string UtilisateurId { get; set; } = "systeme";
    public string Module { get; set; } = "";
    public string Action { get; set; } = "";
    public string Detail { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
