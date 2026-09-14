using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>CRUD des chefs d'établissement.</summary>
public interface IChefsService
{
    /// <summary>Liste les chefs filtrés sous forme de DTO.</summary>
    Task<IReadOnlyList<ChefListDto>> ListAsync(ChefFilterDto filter);
    /// <summary>Retourne un chef par matricule.</summary>
    Task<ChefListDto?> GetAsync(string id);
    /// <summary>Retourne les entités chef correspondant au filtre.</summary>
    Task<List<Chef>> QueryEntitiesAsync(ChefFilterDto filter);
    /// <summary>Crée ou met à jour un chef d'établissement.</summary>
    Task<ApiResultDto> SaveAsync(SaveChefDto dto);
    /// <summary>Supprime un chef s'il n'est plus rattaché à une école.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
}
