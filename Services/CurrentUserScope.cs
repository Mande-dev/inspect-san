using System.Security.Claims;
using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace inspect_san.Services;

/// <summary>Accès au périmètre de données de l'utilisateur courant.</summary>
public interface ICurrentUserScope
{
    /// <summary>Résout le périmètre de données de l'utilisateur authentifié.</summary>
    Task<UserDataScope> GetAsync();
    string? UserId { get; }
}

/// <summary>Périmètre dérivé du HttpContext et du profil Identity.</summary>
public class CurrentUserScope : ICurrentUserScope
{
    private readonly IHttpContextAccessor _http;
    private readonly UserManager<ApplicationUser> _users;

    /// <summary>Initialise le scope avec le contexte HTTP et le gestionnaire d'utilisateurs.</summary>
    public CurrentUserScope(IHttpContextAccessor http, UserManager<ApplicationUser> users)
    {
        _http = http;
        _users = users;
    }

    public string? UserId => _http.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>Résout le périmètre de données de l'utilisateur authentifié.</summary>
    public async Task<UserDataScope> GetAsync()
    {
        var user = _http.HttpContext?.User;
        if (user?.Identity?.IsAuthenticated != true)
            return new UserDataScope();

        var role = user.FindFirstValue(ClaimTypes.Role);
        var id = UserId;
        string? ecoleId = null;
        string? agentId = null;
        if (!string.IsNullOrEmpty(id))
        {
            var appUser = await _users.FindByIdAsync(id);
            ecoleId = appUser?.EcoleId;
            agentId = appUser?.AgentId;
        }
        return DataScope.Resolve(role, id, ecoleId, agentId);
    }
}

/// <summary>Scope non restreint (tests / jobs).</summary>
public sealed class UnrestrictedUserScope : ICurrentUserScope
{
    public static readonly UnrestrictedUserScope Instance = new();
    public string? UserId => null;
    /// <summary>Retourne un périmètre non restreint.</summary>
    public Task<UserDataScope> GetAsync() => Task.FromResult(new UserDataScope { Unrestricted = true });
}

/// <summary>Scope figé (tests unitaires).</summary>
public sealed class FixedUserScope : ICurrentUserScope
{
    private readonly UserDataScope _scope;
    /// <summary>Fige un périmètre de données pour les tests.</summary>
    public FixedUserScope(UserDataScope scope) => _scope = scope;
    public string? UserId => null;
    /// <summary>Retourne le périmètre figé.</summary>
    public Task<UserDataScope> GetAsync() => Task.FromResult(_scope);
}
