using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IChefsService
{
    Task<IReadOnlyList<ChefListDto>> ListAsync(ChefFilterDto filter);
    Task<ChefListDto?> GetAsync(string id);
    Task<List<Chef>> QueryEntitiesAsync(ChefFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveChefDto dto);
    Task<ApiResultDto> DeleteAsync(string id);
}
