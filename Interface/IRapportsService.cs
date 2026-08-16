using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IRapportsService
{
    Task<IReadOnlyList<RapportListDto>> ListAsync();
    Task<List<Rapport>> QueryEntitiesAsync();
    Task<IReadOnlySet<string>> ListFicheIdsConsommeesAsync(string? excludeRapportId = null);
    Task<IReadOnlyList<string>> FindFichesDejaConsommeesAsync(IEnumerable<string>? ficheIds, string? excludeRapportId = null);
    Task<string?> ResolveEquipeIdFromFicheIdsAsync(IEnumerable<string>? ficheIds);
    Task<string> BuildSyntheseAsync(IEnumerable<string>? ficheIds);
    Task<ApiResultDto> SaveAsync(SaveRapportDto dto);
    Task<ApiResultDto> DeposerAsync(string id, string? userId);
    Task<ApiResultDto> DeleteAsync(string id);
}
