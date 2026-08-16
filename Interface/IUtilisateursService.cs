using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IUtilisateursService
{
    Task<IReadOnlyList<UtilisateurListDto>> ListAsync();
    Task<List<Utilisateur>> QueryEntitiesAsync();
    Task<IReadOnlyList<ChefEquipeSansCompteDto>> ListChefsEquipeSansCompteAsync(string? excludeUserId = null);

    /// <summary>Création admin uniquement. Refuse toute mise à jour (Id renseigné).</summary>
    Task<ApiResultDto> CreateAsync(SaveUtilisateurDto dto);

    /// <summary>Compat : délègue à CreateAsync ; refuse si Id présent.</summary>
    Task<ApiResultDto> SaveAsync(SaveUtilisateurDto dto);

    Task<ApiResultDto> SetStatutAsync(string id, string statut);

    Task<ProfilDto?> GetProfilAsync(string userId);
    Task<ApiResultDto> UpdateProfilAsync(string userId, UpdateProfilDto dto);
}
