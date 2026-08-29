namespace inspect_san.Services;

/// <summary>
/// Périmètre données (couche 2, distincte du RBAC CanAccess/CanDo).
/// Admin / DP / Secrétariat : non restreint.
/// Contrôleur = compte agent → filtre AgentId (missions où il participe).
/// </summary>
public sealed class UserDataScope
{
    public bool Unrestricted { get; init; }
    public string? EcoleId { get; init; }
    public string? AgentId { get; init; }

    public bool IsEmpty => !Unrestricted && string.IsNullOrEmpty(EcoleId) && string.IsNullOrEmpty(AgentId);

    public bool AllowsEcole(string? ecoleId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(EcoleId) || string.IsNullOrEmpty(ecoleId)) return false;
        return string.Equals(EcoleId, ecoleId, StringComparison.Ordinal);
    }

    public bool AllowsAgent(string? agentId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(AgentId) || string.IsNullOrEmpty(agentId)) return false;
        return string.Equals(AgentId, agentId, StringComparison.Ordinal);
    }

    public bool AllowsMission(IEnumerable<string>? participantAgentIds, string? ecoleId)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (string.IsNullOrEmpty(AgentId) || participantAgentIds == null) return false;
        return participantAgentIds.Any(id => string.Equals(id, AgentId, StringComparison.Ordinal));
    }

    public bool AllowsFiche(IEnumerable<string>? missionAgentIds, string? ecoleId, ISet<string>? allowedMissionIds, string? missionId)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (AllowsMission(missionAgentIds, ecoleId)) return true;
        return allowedMissionIds != null
               && !string.IsNullOrEmpty(missionId)
               && allowedMissionIds.Contains(missionId);
    }

    public bool AllowsDecision(string? ecoleId) => AllowsEcole(ecoleId);
}

public static class DataScope
{
    public const string RoleAdmin = "Administrateur système";
    public const string RoleDp = "Directeur Provincial";
    public const string RoleControleur = "Contrôleur";
    public const string RoleSecretariat = "Agent du Secrétariat";

    /// <summary>Ancien rôle de connexion — conservé uniquement pour compat / détection legacy.</summary>
    public const string RoleChef = "Chef d'établissement";

    public static UserDataScope Resolve(string? role, string? userId, string? userEcoleId = null, string? userAgentId = null)
    {
        if (string.IsNullOrWhiteSpace(role))
            return new UserDataScope();

        return role switch
        {
            RoleAdmin or RoleDp or RoleSecretariat => new UserDataScope { Unrestricted = true },
            RoleControleur => new UserDataScope
            {
                AgentId = string.IsNullOrWhiteSpace(userAgentId) ? null : userAgentId
            },
            // Plus de périmètre login chef : compte legacy = vide
            RoleChef => new UserDataScope(),
            _ => new UserDataScope()
        };
    }
}
