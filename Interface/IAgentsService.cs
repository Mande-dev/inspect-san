using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>CRUD du vivier d'agents d'inspection.</summary>
public interface IAgentsService
{
    /// <summary>Liste les agents filtrés sous forme de DTO.</summary>
    Task<IReadOnlyList<AgentListDto>> ListAsync(AgentFilterDto filter);
    /// <summary>Retourne les entités agent correspondant au filtre.</summary>
    Task<List<Agent>> QueryEntitiesAsync(AgentFilterDto filter);
    /// <summary>Crée ou met à jour un agent.</summary>
    Task<ApiResultDto> SaveAsync(SaveAgentDto dto);
    /// <summary>Supprime un agent s'il n'est plus utilisé.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
}
