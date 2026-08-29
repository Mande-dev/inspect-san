using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IDecisionsService
{
    Task<IReadOnlyList<DecisionListDto>> ListAsync();
    Task<List<Decision>> QueryEntitiesAsync();
    Task<IReadOnlyList<FicheListDto>> FichesSansDecisionAsync();
    Task<List<FicheControle>> QueryFichesSansDecisionAsync();
    Task<ApiResultDto> SaveAsync(SaveDecisionDto dto, string? userId);
    Task<ApiResultDto> DeleteAsync(string id);
}
