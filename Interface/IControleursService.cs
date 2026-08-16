using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IControleursService
{
    Task<IReadOnlyList<ControleurListDto>> ListAsync(ControleurFilterDto filter);
    Task<List<Controleur>> QueryEntitiesAsync(ControleurFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveControleurDto dto);
    Task<ApiResultDto> DeleteAsync(string id);
}
