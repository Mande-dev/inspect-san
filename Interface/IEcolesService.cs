using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>CRUD des établissements scolaires et de leurs listes de référence.</summary>
public interface IEcolesService
{
    /// <summary>Liste les établissements filtrés sous forme de DTO.</summary>
    Task<IReadOnlyList<EcoleListDto>> ListAsync(EcoleFilterDto filter);
    /// <summary>Retourne un établissement par identifiant.</summary>
    Task<EcoleListDto?> GetAsync(string id);
    /// <summary>Retourne les entités école correspondant au filtre.</summary>
    Task<List<Ecole>> QueryEntitiesAsync(EcoleFilterDto filter);
    /// <summary>Crée ou met à jour un établissement.</summary>
    Task<ApiResultDto> SaveAsync(SaveEcoleDto dto);
    /// <summary>Supprime un établissement s'il n'a pas de missions.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
    /// <summary>Tente de désactiver un établissement (selon la structure).</summary>
    Task<ApiResultDto> DeactivateAsync(string id);
    /// <summary>Charge les listes sous-divisions et régimes.</summary>
    Task<(IReadOnlyList<RefItem> Sousproveds, IReadOnlyList<RefItem> Regimes)> GetLookupsAsync();
    /// <summary>Charge la liste des catégories d'établissement.</summary>
    Task<IReadOnlyList<RefItem>> GetCategoriesAsync();
}
