namespace inspect_san.Services;

/// <summary>
/// Périmètre données (couche 2, distincte du RBAC CanAccess/CanDo).
/// Admin / DP / Secrétariat : non restreint.
/// Contrôleur = compte d’équipe → filtre EquipeId.
/// Chef : EcoleId.
/// </summary>
public sealed class UserDataScope
{
    public bool Unrestricted { get; init; }
    public string? EcoleId { get; init; }
    public string? EquipeId { get; init; }

    public bool IsEmpty => !Unrestricted && string.IsNullOrEmpty(EcoleId) && string.IsNullOrEmpty(EquipeId);

    public bool AllowsEcole(string? ecoleId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(EcoleId) || string.IsNullOrEmpty(ecoleId)) return false;
        return string.Equals(EcoleId, ecoleId, StringComparison.Ordinal);
    }

    public bool AllowsEquipe(string? equipeId)
    {
        if (Unrestricted) return true;
        if (string.IsNullOrEmpty(EquipeId) || string.IsNullOrEmpty(equipeId)) return false;
        return string.Equals(EquipeId, equipeId, StringComparison.Ordinal);
    }

    public bool AllowsOrdre(string? equipeId, string? ecoleId)
    {
        if (Unrestricted) return true;
        if (AllowsEquipe(equipeId)) return true;
        return AllowsEcole(ecoleId);
    }

    public bool AllowsFiche(string? ordreEquipeId, string? ecoleId, ISet<string>? allowedOrdreIds, string? ordreMissionId)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (AllowsEquipe(ordreEquipeId)) return true;
        return allowedOrdreIds != null
               && !string.IsNullOrEmpty(ordreMissionId)
               && allowedOrdreIds.Contains(ordreMissionId);
    }

    public bool AllowsRapport(string? ecoleId, IEnumerable<string>? ficheIds, ISet<string>? allowedFicheIds)
    {
        if (Unrestricted) return true;
        if (AllowsEcole(ecoleId)) return true;
        if (allowedFicheIds == null || ficheIds == null) return false;
        return ficheIds.Any(id => allowedFicheIds.Contains(id));
    }

    public bool AllowsDecision(string? ecoleId) => AllowsEcole(ecoleId);
}

public static class DataScope
{
    public const string RoleAdmin = "Administrateur système";
    public const string RoleDp = "Directeur Provincial";
    public const string RoleControleur = "Contrôleur"; // = compte chef d’équipe (1 login / équipe)
    public const string RoleSecretariat = "Agent du Secrétariat";
    public const string RoleChef = "Chef d'établissement";

    /// <param name="userEcoleId">ApplicationUser.EcoleId (Chef).</param>
    /// <param name="userEquipeId">ApplicationUser.EquipeId (Contrôleur / compte équipe).</param>
    public static UserDataScope Resolve(string? role, string? userId, string? userEcoleId = null, string? userEquipeId = null)
    {
        if (string.IsNullOrWhiteSpace(role))
            return new UserDataScope();

        return role switch
        {
            RoleAdmin or RoleDp or RoleSecretariat => new UserDataScope { Unrestricted = true },
            RoleControleur => new UserDataScope
            {
                EquipeId = string.IsNullOrWhiteSpace(userEquipeId) ? null : userEquipeId
            },
            RoleChef => new UserDataScope
            {
                EcoleId = string.IsNullOrWhiteSpace(userEcoleId) ? null : userEcoleId
            },
            _ => new UserDataScope()
        };
    }
}
