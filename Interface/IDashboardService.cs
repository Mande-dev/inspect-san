using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

/// <summary>Service du tableau de bord selon le rôle et le périmètre utilisateur.</summary>
public interface IDashboardService
{
    /// <summary>Calcule les indicateurs du tableau de bord pour l'utilisateur courant.</summary>
    /// <param name="userEcoleId">ApplicationUser.EcoleId pour le Chef (sinon null).</param>
    /// <param name="userAgentId">ApplicationUser.AgentId pour le Contrôleur (sinon null).</param>
    Task<DashboardDto> GetDashboardAsync(
        string role, string? userId, string? userEcoleId = null, string? userAgentId = null);
}
