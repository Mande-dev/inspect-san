using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IAgentsService
{
    Task<IReadOnlyList<AgentListDto>> ListAsync(AgentFilterDto filter);
    Task<List<Agent>> QueryEntitiesAsync(AgentFilterDto filter);
    Task<ApiResultDto> SaveAsync(SaveAgentDto dto);
    Task<ApiResultDto> DeleteAsync(string id);
}
