using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

public interface IDashboardService
{
    /// <param name="userEcoleId">ApplicationUser.EcoleId pour le Chef (sinon null).</param>
    /// <param name="userAgentId">ApplicationUser.AgentId pour le Contrôleur (sinon null).</param>
    Task<DashboardDto> GetDashboardAsync(
        string role, string? userId, string? userEcoleId = null, string? userAgentId = null);
}
