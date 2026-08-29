using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

public interface IStatistiquesService
{
    Task<StatistiquesDto> GetAsync(StatistiquesFilterDto filter);
    Task<string> ExportCsvAsync(StatistiquesFilterDto filter);
    Task<RapportInspectionResponseDto> GetRapportInspectionAsync(
        RapportInspectionFilterDto filter,
        string? role = null,
        string? agentId = null);
    Task<ApiResultDto> DeposerRapportEquipeAsync(string sousDivisionCode, string? userId, string? agentId);
    Task<ApiResultDto> DeposerRapportSecretariatAsync(string sousDivisionCode, string? userId);
    Task<ApiResultDto> CloturerRapportAsync(string sousDivisionCode, string? userId, bool forceAdmin = false);
}
