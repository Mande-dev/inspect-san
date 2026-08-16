using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IFichesControleService
{
    Task<IReadOnlyList<FicheListDto>> ListAsync(FicheFilterDto filter);
    Task<List<FicheControle>> QueryEntitiesAsync(FicheFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveFicheControleDto dto);
    Task<ApiResultDto> UploadPhotoAsync(string ficheId, IFormFile file, string? legende = null);
    Task<ApiResultDto> SoumettrePourValidationAsync(string id, string? userId);
    Task<ApiResultDto> ValiderAsync(string id, string? userId);
    Task<ApiResultDto> DeleteAsync(string id);
}
