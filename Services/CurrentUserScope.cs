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
        string? equipeId = null;
        if (!string.IsNullOrEmpty(id))
        {
            var appUser = await _users.FindByIdAsync(id);
            ecoleId = appUser?.EcoleId;
            equipeId = appUser?.EquipeId;
        }
        return DataScope.Resolve(role, id, ecoleId, equipeId);
    }
}
