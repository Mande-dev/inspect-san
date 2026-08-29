using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Droits lecture/écriture dérivés de l'affectation mission (fonction + délégation).</summary>
public interface IMissionAccessService
{
    Task<bool> CanReadMissionAsync(string missionId, string? agentId, bool unrestricted);
    Task<bool> CanWriteMissionAsync(string missionId, string? agentId, bool unrestricted);
    Task<bool> IsChefEquipeAsync(string missionId, string? agentId);
    bool CanWriteFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted);
    bool CanReadFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted);
}

public class MissionAccessService : IMissionAccessService
{
    private readonly InspectSanDbContext _db;

    public MissionAccessService(InspectSanDbContext db) => _db = db;

    public async Task<bool> CanReadMissionAsync(string missionId, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId) || string.IsNullOrWhiteSpace(missionId)) return false;
        return await _db.Affectations.AsNoTracking()
            .AnyAsync(a => a.Mission!.Id == missionId && a.MatrAgent == agentId);
    }

    public async Task<bool> CanWriteMissionAsync(string missionId, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId) || string.IsNullOrWhiteSpace(missionId)) return false;
        var aff = await _db.Affectations.AsNoTracking()
            .Where(a => a.Mission!.Id == missionId && a.MatrAgent == agentId)
            .Select(a => new { a.Fonction, a.EcritureDeleguee })
            .FirstOrDefaultAsync();
        if (aff == null) return false;
        if (aff.Fonction == RolesMissionCodes.ChefEquipe) return true;
        if (aff.Fonction == RolesMissionCodes.ChefAdjoint && aff.EcritureDeleguee) return true;
        return false;
    }

    public async Task<bool> IsChefEquipeAsync(string missionId, string? agentId)
    {
        if (string.IsNullOrWhiteSpace(agentId) || string.IsNullOrWhiteSpace(missionId)) return false;
        return await _db.Affectations.AsNoTracking()
            .AnyAsync(a => a.Mission!.Id == missionId
                           && a.MatrAgent == agentId
                           && a.Fonction == RolesMissionCodes.ChefEquipe);
    }

    public bool CanWriteFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId)) return false;
        var aff = affectations.FirstOrDefault(a =>
            string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal));
        if (aff == null) return false;
        if (aff.Fonction == RolesMissionCodes.ChefEquipe) return true;
        return aff.Fonction == RolesMissionCodes.ChefAdjoint && aff.EcritureDeleguee;
    }

    public bool CanReadFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId)) return false;
        return affectations.Any(a => string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal));
    }
}
