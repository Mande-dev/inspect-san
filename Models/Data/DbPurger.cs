using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace inspect_san.Models.Data;

/// <summary>Purge ciblée des données métier et des uploads.</summary>
public static class DbPurger
{
    /// <summary>Vide les tables métier tout en conservant les utilisateurs.</summary>
    public static async Task PurgeEntitiesMetierAsync(
        InspectSanDbContext db,
        ILogger logger,
        CancellationToken ct = default)
    {
        logger.LogWarning("PURGE entités métier…");

        const string sql = """
            SET FOREIGN_KEY_CHECKS = 0;
            DELETE FROM `Decision`;
            DELETE FROM `Photos`;
            DELETE FROM `Affectation`;
            DELETE FROM `Mission`;
            UPDATE `AspNetUsers` SET `EcoleId` = NULL, `AgentId` = NULL
                WHERE `EcoleId` IS NOT NULL OR `AgentId` IS NOT NULL;
            DELETE FROM `Etablissement`;
            DELETE FROM `Agents`;
            SET FOREIGN_KEY_CHECKS = 1;
            """;

        await db.Database.ExecuteSqlRawAsync(sql, ct);
        logger.LogWarning("PURGE entités métier terminée.");
    }

    /// <summary>Purge complète sauf le compte administrateur.</summary>
    public static async Task PurgeKeepAdminAsync(
        InspectSanDbContext db,
        UserManager<ApplicationUser> users,
        ILogger logger,
        CancellationToken ct = default)
    {
        logger.LogWarning("PURGE BDD : conservation uniquement du compte administrateur…");

        const string sql = """
            SET FOREIGN_KEY_CHECKS = 0;
            DELETE FROM `Decision`;
            DELETE FROM `Photos`;
            DELETE FROM `MissionProduit`;
            DELETE FROM `MissionOutil`;
            DELETE FROM `Affectation`;
            DELETE FROM `Mission`;
            DELETE FROM `Etablissement`;
            DELETE FROM `ChefEtablissement`;
            DELETE FROM `Agents`;
            DELETE FROM `ProduitUtilise`;
            DELETE FROM `OutilUtilise`;
            DELETE FROM `Categories`;
            DELETE FROM `JournalEntries`;
            DELETE FROM `Notifications`;
            SET FOREIGN_KEY_CHECKS = 1;
            """;

        await db.Database.ExecuteSqlRawAsync(sql, ct);
        logger.LogInformation("Tables métier vidées (DELETE batch).");

        var adminId = IdentitySeeder.AdminId;
        var adminEmail = IdentitySeeder.AdminEmail;

        var allUsers = await users.Users.ToListAsync(ct);
        foreach (var u in allUsers)
        {
            var keep = string.Equals(u.Id, adminId, StringComparison.Ordinal)
                       || string.Equals(u.Email, adminEmail, StringComparison.OrdinalIgnoreCase)
                       || string.Equals(u.UserName, adminEmail, StringComparison.OrdinalIgnoreCase);
            if (keep) continue;

            var result = await users.DeleteAsync(u);
            if (result.Succeeded)
                logger.LogInformation("User supprimé : {Email} ({Id})", u.Email, u.Id);
            else
                logger.LogWarning("Échec suppression {Email} : {Errors}",
                    u.Email, string.Join("; ", result.Errors.Select(e => e.Description)));
        }
    }

    /// <summary>Supprime le contenu du dossier uploads.</summary>
    public static void ClearUploads(string webRootPath, ILogger logger)
    {
        var uploads = Path.Combine(webRootPath, "uploads");
        if (!Directory.Exists(uploads))
            return;

        foreach (var entry in Directory.EnumerateFileSystemEntries(uploads))
        {
            try
            {
                if (Directory.Exists(entry))
                    Directory.Delete(entry, recursive: true);
                else
                    File.Delete(entry);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Impossible de supprimer {Entry}", entry);
            }
        }
    }
}
