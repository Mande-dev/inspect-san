using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Droits lecture/écriture dérivés de l'affectation mission (fonction + délégation).</summary>
public interface IMissionAccessService
{
    /// <summary>Indique si l'agent peut lire la mission.</summary>
    Task<bool> CanReadMissionAsync(string missionId, string? agentId, bool unrestricted);
    /// <summary>Indique si l'agent peut écrire sur la mission.</summary>
    Task<bool> CanWriteMissionAsync(string missionId, string? agentId, bool unrestricted);
    /// <summary>Indique si l'agent est chef d'équipe de la mission.</summary>
    Task<bool> IsChefEquipeAsync(string missionId, string? agentId);
    /// <summary>Évalue le droit d'écriture à partir d'affectations déjà chargées.</summary>
    bool CanWriteFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted);
    /// <summary>Évalue le droit de lecture à partir d'affectations déjà chargées.</summary>
    bool CanReadFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted);
}

/// <summary>Implémentation des droits mission basés sur les affectations.</summary>
public class MissionAccessService : IMissionAccessService
{
    private readonly InspectSanDbContext _db;

    /// <summary>Initialise le service avec le contexte EF.</summary>
    public MissionAccessService(InspectSanDbContext db) => _db = db;

    /// <summary>Indique si l'agent peut lire la mission.</summary>
    public async Task<bool> CanReadMissionAsync(string missionId, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId) || string.IsNullOrWhiteSpace(missionId)) return false;
        return await _db.Affectations.AsNoTracking()
            .AnyAsync(a => a.Mission!.Id == missionId && a.MatrAgent == agentId);
    }

    /// <summary>Indique si l'agent peut écrire sur la mission.</summary>
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

    /// <summary>Indique si l'agent est chef d'équipe de la mission.</summary>
    public async Task<bool> IsChefEquipeAsync(string missionId, string? agentId)
    {
        if (string.IsNullOrWhiteSpace(agentId) || string.IsNullOrWhiteSpace(missionId)) return false;
        return await _db.Affectations.AsNoTracking()
            .AnyAsync(a => a.Mission!.Id == missionId
                           && a.MatrAgent == agentId
                           && a.Fonction == RolesMissionCodes.ChefEquipe);
    }

    /// <summary>Évalue le droit d'écriture à partir d'affectations déjà chargées.</summary>
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

    /// <summary>Évalue le droit de lecture à partir d'affectations déjà chargées.</summary>
    public bool CanReadFromAffectations(IEnumerable<Affectation> affectations, string? agentId, bool unrestricted)
    {
        if (unrestricted) return true;
        if (string.IsNullOrWhiteSpace(agentId)) return false;
        return affectations.Any(a => string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal));
    }
}
