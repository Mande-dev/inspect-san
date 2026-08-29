using Microsoft.AspNetCore.Identity;

namespace inspect_san.Models.Identity;

/// <summary>
/// Utilisateur Identity. UserName = identifiant de connexion (ex. admin).
/// Email = contact. Role = rôle métier principal (libellé AccessControl), synchronisé avec AspNetRoles.
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string Nom { get; set; } = "";
    public string Statut { get; set; } = "actif";
    public string? Telephone { get; set; }
    /// <summary>Rôle métier principal (ex. « Contrôleur ») — dénormalisé pour filtres / UI.</summary>
    public string Role { get; set; } = "";
    /// <summary>Établissement lié (Chef d'établissement).</summary>
    public string? EcoleId { get; set; }
    /// <summary>Agent lié au compte Contrôleur (1 user / AgentId).</summary>
    public string? AgentId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
