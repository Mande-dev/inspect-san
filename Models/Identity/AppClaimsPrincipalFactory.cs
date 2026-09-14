using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace inspect_san.Models.Identity;

/// <summary>Claims : Name = Nom affiché, Role via Identity, claim « identifiant » = UserName.</summary>
public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
{
    /// <summary>Injecte UserManager, RoleManager et les options Identity.</summary>
    public AppClaimsPrincipalFactory(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> options)
        : base(userManager, roleManager, options)
    {
    }

    /// <summary>Enrichit les claims (nom affiché, identifiant, rôle métier).</summary>
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
    {
        var identity = await base.GenerateClaimsAsync(user);

        var name = identity.FindFirst(ClaimTypes.Name);
        if (name != null)
            identity.RemoveClaim(name);
        identity.AddClaim(new Claim(ClaimTypes.Name, string.IsNullOrWhiteSpace(user.Nom) ? (user.UserName ?? "") : user.Nom));

        if (!string.IsNullOrEmpty(user.UserName))
            identity.AddClaim(new Claim("identifiant", user.UserName));

        // Garantit ClaimTypes.Role même si AspNetUserRoles n'est pas encore synchronisé
        if (!string.IsNullOrWhiteSpace(user.Role) && !identity.HasClaim(ClaimTypes.Role, user.Role))
            identity.AddClaim(new Claim(ClaimTypes.Role, user.Role));

        return identity;
    }
}
