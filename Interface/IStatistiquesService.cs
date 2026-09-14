using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

/// <summary>Statistiques, exports et rapports d'inspection par sous-division.</summary>
public interface IStatistiquesService
{
    /// <summary>Calcule les statistiques selon le filtre fourni.</summary>
    Task<StatistiquesDto> GetAsync(StatistiquesFilterDto filter);
    /// <summary>Exporte les statistiques au format CSV.</summary>
    Task<string> ExportCsvAsync(StatistiquesFilterDto filter);
    /// <summary>Construit le rapport d'inspection pour une sous-division.</summary>
    Task<RapportInspectionResponseDto> GetRapportInspectionAsync(
        RapportInspectionFilterDto filter,
        string? role = null,
        string? agentId = null);
    /// <summary>Dépose le rapport côté équipe pour une sous-division.</summary>
    Task<ApiResultDto> DeposerRapportEquipeAsync(string sousDivisionCode, string? userId, string? agentId);
    /// <summary>Dépose le rapport côté secrétariat pour une sous-division.</summary>
    Task<ApiResultDto> DeposerRapportSecretariatAsync(string sousDivisionCode, string? userId);
    /// <summary>Clôture le rapport d'une sous-division.</summary>
    Task<ApiResultDto> CloturerRapportAsync(string sousDivisionCode, string? userId, bool forceAdmin = false);
}
