using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IAccusesService
{
    Task<IReadOnlyList<AccuseListDto>> ListAsync(AccuseFilterDto filter);
    Task<List<Rapport>> QueryEntitiesAsync();
    Task<ApiResultDto> AccuserAsync(string id, string? userId);
    Task<ApiResultDto> TransmettreAsync(string id);
}
