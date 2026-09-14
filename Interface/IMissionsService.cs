using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>Gestion du cycle de vie des missions d'inspection.</summary>
public interface IMissionsService
{
    /// <summary>Liste les missions filtrées sous forme de DTO.</summary>
    Task<IReadOnlyList<MissionListDto>> ListAsync(MissionFilterDto filter);
    /// <summary>Retourne les entités mission correspondant au filtre.</summary>
    Task<List<Mission>> QueryEntitiesAsync(MissionFilterDto filter);
    /// <summary>Crée ou met à jour une mission.</summary>
    Task<ApiResultDto> SaveAsync(SaveMissionDto dto);
    /// <summary>brouillon → en_attente_signature</summary>
    Task<ApiResultDto> DemanderSignatureAsync(string id, string? userId);
    /// <summary>brouillon | en_attente_signature → signe</summary>
    Task<ApiResultDto> SignerAsync(string id, string? userId);
    /// <summary>signe → en_cours (aussi déclenché à la 1re fiche créée)</summary>
    Task<ApiResultDto> PasserEnCoursAsync(string id, string? userId = null);
    /// <summary>en_cours → cloture (aussi déclenché après décision sur mission liée)</summary>
    Task<ApiResultDto> CloturerAsync(string id, string? userId = null);
    /// <summary>Supprime une mission si le statut et les droits le permettent.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
    /// <summary>Délègue l'écriture au chef adjoint de la mission.</summary>
    Task<ApiResultDto> DeleguerEcritureAdjointAsync(string missionId, string? userId);
    /// <summary>Retire la délégation d'écriture du chef adjoint.</summary>
    Task<ApiResultDto> RetirerDelegationAdjointAsync(string missionId, string? userId);
}
