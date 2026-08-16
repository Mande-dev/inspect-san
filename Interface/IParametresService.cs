using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IParametresService
{
    Task<IReadOnlyList<RefItemDto>> ListAsync(string tab);
    Task<List<RefItem>> QueryEntitiesAsync(string tab);
    Task<ApiResultDto> SaveAsync(string tab, SaveRefItemDto dto);
    /// <summary>Création / édition équipe (chef optionnel, SaveEquipeDto dédié).</summary>
    Task<ApiResultDto> SaveEquipeAsync(SaveEquipeDto dto);
    Task<ApiResultDto> DeleteAsync(string tab, string id);
}
