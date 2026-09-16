using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>CRUD des référentiels de paramètres (catégories, produits, outils, sous-divisions).</summary>
public interface IParametresService
{
    /// <summary>Liste les éléments du référentiel pour un onglet donné.</summary>
    Task<IReadOnlyList<RefItemDto>> ListAsync(string tab);
    /// <summary>Retourne les entités de référence pour un onglet.</summary>
    Task<List<RefItem>> QueryEntitiesAsync(string tab);
    /// <summary>Crée ou met à jour un élément de référentiel.</summary>
    Task<ApiResultDto> SaveAsync(string tab, SaveRefItemDto dto);
    /// <summary>Supprime un élément de référentiel s'il n'est plus utilisé.</summary>
    Task<ApiResultDto> DeleteAsync(string tab, string id);
}
