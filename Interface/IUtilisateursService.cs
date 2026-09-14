using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>Gestion des comptes utilisateurs et du profil connecté.</summary>
public interface IUtilisateursService
{
    /// <summary>Liste les utilisateurs sous forme de DTO.</summary>
    Task<IReadOnlyList<UtilisateurListDto>> ListAsync();
    /// <summary>Retourne les entités utilisateur.</summary>
    Task<List<Utilisateur>> QueryEntitiesAsync();
    /// <summary>Liste les agents sans compte utilisateur associé.</summary>
    Task<IReadOnlyList<AgentSansCompteDto>> ListAgentsSansCompteAsync(string? excludeUserId = null);

    /// <summary>Création admin uniquement. Refuse toute mise à jour (Id renseigné).</summary>
    Task<ApiResultDto> CreateAsync(SaveUtilisateurDto dto);

    /// <summary>Compat : délègue à CreateAsync ; refuse si Id présent.</summary>
    Task<ApiResultDto> SaveAsync(SaveUtilisateurDto dto);

    /// <summary>Active ou désactive un compte utilisateur.</summary>
    Task<ApiResultDto> SetStatutAsync(string id, string statut);

    /// <summary>Charge le profil de l'utilisateur connecté.</summary>
    Task<ProfilDto?> GetProfilAsync(string userId);
    /// <summary>Met à jour le profil de l'utilisateur connecté.</summary>
    Task<ApiResultDto> UpdateProfilAsync(string userId, UpdateProfilDto dto);
}
