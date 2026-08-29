using System.Security.Claims;
using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace inspect_san.Services;

public interface ICurrentUserScope
{
    Task<UserDataScope> GetAsync();
    string? UserId { get; }
}

public class CurrentUserScope : ICurrentUserScope
{
    private readonly IHttpContextAccessor _http;
    private readonly UserManager<ApplicationUser> _users;

    public CurrentUserScope(IHttpContextAccessor http, UserManager<ApplicationUser> users)
    {
        _http = http;
        _users = users;
    }

    public string? UserId => _http.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

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
    public Task<UserDataScope> GetAsync() => Task.FromResult(new UserDataScope { Unrestricted = true });
}

/// <summary>Scope figé (tests unitaires).</summary>
public sealed class FixedUserScope : ICurrentUserScope
{
    private readonly UserDataScope _scope;
    public FixedUserScope(UserDataScope scope) => _scope = scope;
    public string? UserId => null;
    public Task<UserDataScope> GetAsync() => Task.FromResult(_scope);
}
