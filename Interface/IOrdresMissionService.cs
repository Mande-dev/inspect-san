using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IOrdresMissionService
{
    Task<IReadOnlyList<OrdreListDto>> ListAsync(OrdreFilterDto filter);
    Task<List<OrdreMission>> QueryEntitiesAsync(OrdreFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveOrdreMissionDto dto);
    /// <summary>brouillon → en_attente_signature</summary>
    Task<ApiResultDto> DemanderSignatureAsync(string id, string? userId);
    /// <summary>brouillon | en_attente_signature → signe</summary>
    Task<ApiResultDto> SignerAsync(string id, string? userId);
    /// <summary>signe → en_cours (aussi déclenché à la 1re fiche créée)</summary>
    Task<ApiResultDto> PasserEnCoursAsync(string id, string? userId = null);
    /// <summary>en_cours → cloture (aussi déclenché après décision sur mission liée)</summary>
    Task<ApiResultDto> CloturerAsync(string id, string? userId = null);
    Task<ApiResultDto> DeleteAsync(string id);
}
