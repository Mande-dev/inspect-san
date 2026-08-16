using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

public interface IDashboardService
{
    /// <param name="userEcoleId">ApplicationUser.EcoleId pour le Chef (sinon null).</param>
    /// <param name="userEquipeId">ApplicationUser.EquipeId pour le Contrôleur / compte équipe (sinon null).</param>
    Task<DashboardDto> GetDashboardAsync(
        string role, string? userId, string? userEcoleId = null, string? userEquipeId = null);
}
