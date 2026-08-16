using Microsoft.AspNetCore.Identity;

namespace inspect_san.Models.Identity;

/// <summary>
/// Utilisateur Identity. UserName = identifiant de connexion (ex. admin).
/// Email = contact. Role = rôle métier principal (libellé AccessControl), synchronisé avec AspNetRoles.
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string Nom { get; set; } = "";
    /// <summary>Libellé équipe (dénormalisé, optionnel). Source de vérité : EquipeId.</summary>
    public string? Equipe { get; set; }
    public string Statut { get; set; } = "actif";
    public string? Telephone { get; set; }
    /// <summary>Rôle métier principal (ex. « Contrôleur ») — dénormalisé pour filtres / UI.</summary>
    public string Role { get; set; } = "";
    /// <summary>Établissement lié (Chef d'établissement).</summary>
    public string? EcoleId { get; set; }
    /// <summary>Équipe liée (compte Contrôleur = chef d’équipe, 1 compte / équipe).</summary>
    public string? EquipeId { get; set; }
    /// <summary>Membre chef d’équipe lié au compte Contrôleur (1 user / ControleurId).</summary>
    public string? ControleurId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
