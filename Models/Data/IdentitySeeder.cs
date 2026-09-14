using inspect_san.Models.Identity;
using inspect_san.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Models.Data;

/// <summary>
/// Seed Identity : garantit les rôles + le compte admin démo.
/// Ne purge pas les utilisateurs créés via l’UI (persistants en BDD).
/// Les ids historiques (usr-00x) dans le seed métier restent des refs texte (option A).
/// </summary>
public static class IdentitySeeder
{
    public const string AdminId = "usr-001";
    public const string AdminEmail = "admin@inspect-san.cd";
    public const string AdminPassword = "admin123";
    public const string AdminNom = "Admin Système";
    public const string AdminRole = "Administrateur système";

    /// <summary>Garantit les rôles Identity et le compte admin démo.</summary>
    public static async Task SeedAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        CancellationToken ct = default)
    {
        foreach (var roleName in AccessControl.RoleAccess.Keys)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
                await roleManager.CreateAsync(new IdentityRole(roleName));
        }

        var admin = await userManager.FindByIdAsync(AdminId)
                    ?? await userManager.FindByEmailAsync(AdminEmail)
                    ?? await userManager.FindByNameAsync(AdminEmail)
                    ?? await userManager.FindByNameAsync("admin");

        if (admin == null)
        {
            admin = new ApplicationUser
            {
                Id = AdminId,
                UserName = AdminEmail,
                Email = AdminEmail,
                EmailConfirmed = true,
                Nom = AdminNom,
                Role = AdminRole,
                Statut = "actif",
                AgentId = null,
                EcoleId = null,
                Telephone = null,
                CreatedAt = DateTime.UtcNow
            };
            var create = await userManager.CreateAsync(admin, AdminPassword);
            if (!create.Succeeded)
                throw new InvalidOperationException(
                    $"Échec seed admin: {string.Join("; ", create.Errors.Select(e => e.Description))}");
        }
        else
        {
            admin.UserName = AdminEmail;
            admin.NormalizedUserName = userManager.NormalizeName(AdminEmail);
            admin.Email = AdminEmail;
            admin.NormalizedEmail = userManager.NormalizeEmail(AdminEmail);
            admin.EmailConfirmed = true;
            admin.Nom = AdminNom;
            admin.Role = AdminRole;
            admin.Statut = "actif";
            // Admin reste sans périmètre (pas d’AgentId / EcoleId).
            admin.AgentId = null;
            admin.EcoleId = null;
            var update = await userManager.UpdateAsync(admin);
            if (!update.Succeeded)
                throw new InvalidOperationException(
                    $"Échec MAJ admin: {string.Join("; ", update.Errors.Select(e => e.Description))}");

            if (!await userManager.CheckPasswordAsync(admin, AdminPassword))
            {
                var token = await userManager.GeneratePasswordResetTokenAsync(admin);
                var pwdResult = await userManager.ResetPasswordAsync(admin, token, AdminPassword);
                if (!pwdResult.Succeeded)
                    throw new InvalidOperationException(
                        $"Échec reset MDP admin: {string.Join("; ", pwdResult.Errors.Select(e => e.Description))}");
            }
        }

        if (!await roleManager.RoleExistsAsync(AdminRole))
            await roleManager.CreateAsync(new IdentityRole(AdminRole));

        var roles = await userManager.GetRolesAsync(admin);
        if (!roles.Contains(AdminRole))
        {
            if (roles.Count > 0)
                await userManager.RemoveFromRolesAsync(admin, roles);
            await userManager.AddToRoleAsync(admin, AdminRole);
        }
    }
}
