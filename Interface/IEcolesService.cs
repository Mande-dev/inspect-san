using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IEcolesService
{
    Task<IReadOnlyList<EcoleListDto>> ListAsync(EcoleFilterDto filter);
    Task<EcoleListDto?> GetAsync(string id);
    Task<List<Ecole>> QueryEntitiesAsync(EcoleFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveEcoleDto dto);
    Task<ApiResultDto> DeleteAsync(string id);
    Task<ApiResultDto> DeactivateAsync(string id);
    Task<(IReadOnlyList<RefItem> Sousproveds, IReadOnlyList<RefItem> Regimes)> GetLookupsAsync();
    Task<IReadOnlyList<RefItem>> GetCategoriesAsync();
}
