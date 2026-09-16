namespace inspect_san.Services;

/// <summary>
/// Périmètre données (couche 2, distincte du RBAC CanAccess/CanDo).
/// Admin / Directeur Provincial : non restreint.
/// Contrôleur = compte agent → filtre AgentId (missions où il participe).
/// </summary>
public sealed class UserDataScope
{
    public bool Unrestricted { get; init; }
    public string? EcoleId { get; init; }
    public string? AgentId { get; init; }

    public bool IsEmpty => !Unrestricted && string.IsNullOrEmpty(EcoleId) && string.IsNullOrEmpty(AgentId);

    /// <summary>Indique si l'école appartient au périmètre courant.</summary>
    public bool AllowsEcole(string? ecoleId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(EcoleId) || string.IsNullOrEmpty(ecoleId)) return false;
        return string.Equals(EcoleId, ecoleId, StringComparison.Ordinal);
    }

    /// <summary>Indique si l'agent appartient au périmètre courant.</summary>
    public bool AllowsAgent(string? agentId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(AgentId) || string.IsNullOrEmpty(agentId)) return false;
        return string.Equals(AgentId, agentId, StringComparison.Ordinal);
    }

    /// <summary>Indique si une mission est visible selon école ou participation.</summary>
    public bool AllowsMission(IEnumerable<string>? participantAgentIds, string? ecoleId)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (string.IsNullOrEmpty(AgentId) || participantAgentIds == null) return false;
        return participantAgentIds.Any(id => string.Equals(id, AgentId, StringComparison.Ordinal));
    }

    /// <summary>Indique si une fiche est visible selon mission, école ou liste autorisée.</summary>
    public bool AllowsFiche(IEnumerable<string>? missionAgentIds, string? ecoleId, ISet<string>? allowedMissionIds, string? missionId)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (AllowsMission(missionAgentIds, ecoleId)) return true;
        return allowedMissionIds != null
               && !string.IsNullOrEmpty(missionId)
               && allowedMissionIds.Contains(missionId);
    }

    /// <summary>Indique si une décision est visible selon l'école liée.</summary>
    public bool AllowsDecision(string? ecoleId) => AllowsEcole(ecoleId);
}

/// <summary>Résolution du périmètre de données selon le rôle applicatif.</summary>
public static class DataScope
{
    public const string RoleAdmin = "Administrateur système";
    public const string RoleDp = "Directeur Provincial";
    public const string RoleControleur = "Contrôleur";

    /// <summary>Ancien rôle de connexion — conservé uniquement pour compat / détection legacy.</summary>
    public const string RoleChef = "Chef d'établissement";

    /// <summary>Ancien rôle secrétariat — plus attribué ; droits repris par le Directeur Provincial.</summary>
    [Obsolete("Rôle retiré : droits transférés au Directeur Provincial.")]
    public const string RoleSecretariat = "Agent du Secrétariat";

    /// <summary>Construit le périmètre de données à partir du rôle et des liens utilisateur.</summary>
    public static UserDataScope Resolve(string? role, string? userId, string? userEcoleId = null, string? userAgentId = null)
    {
        if (string.IsNullOrWhiteSpace(role))
            return new UserDataScope();

        return role switch
        {
            RoleAdmin or RoleDp => new UserDataScope { Unrestricted = true },
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
