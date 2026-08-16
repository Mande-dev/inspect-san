using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace inspect_san.Models.Data;

/// <summary>
/// Purge one-shot : vide le métier + référentiels + users Identity sauf admin.
/// </summary>
public static class DbPurger
{
    public static async Task PurgeKeepAdminAsync(
        InspectSanDbContext db,
        UserManager<ApplicationUser> users,
        ILogger logger,
        CancellationToken ct = default)
    {
        logger.LogWarning("PURGE BDD : conservation uniquement du compte administrateur…");

        // Un seul batch sur la même connexion : FOREIGN_KEY_CHECKS doit rester actif
        // pour toute la série (le pool EF sinon réinitialise la session).
        const string sql = """
            SET FOREIGN_KEY_CHECKS = 0;
            DELETE FROM `Decisions`;
            DELETE FROM `RapportFiches`;
            DELETE FROM `Rapports`;
            DELETE FROM `FichePhotos`;
            DELETE FROM `FichesControle`;
            DELETE FROM `OrdresMission`;
            DELETE FROM `EcoleDocuments`;
            DELETE FROM `Chefs`;
            DELETE FROM `Ecoles`;
            DELETE FROM `Controleurs`;
            DELETE FROM `Equipes`;
            DELETE FROM `Communes`;
            DELETE FROM `Regimes`;
            DELETE FROM `TypesDecision`;
            DELETE FROM `JournalEntries`;
            DELETE FROM `Notifications`;
            SET FOREIGN_KEY_CHECKS = 1;
            """;

        await db.Database.ExecuteSqlRawAsync(sql, ct);
        logger.LogInformation("Tables métier + référentiels vidées (DELETE batch).");

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

        var remaining = await users.Users.AsNoTracking()
            .Select(u => new { u.Id, u.Email, u.Role, u.Statut })
            .ToListAsync(ct);
        logger.LogWarning("PURGE terminée — users restants ({Count}) : {Users}",
            remaining.Count,
            string.Join(", ", remaining.Select(u => $"{u.Email}/{u.Id}")));
    }

    /// <summary>Supprime le contenu de wwwroot/uploads (fichiers), conserve le dossier.</summary>
    public static void ClearUploads(string webRootPath, ILogger logger)
    {
        var uploads = Path.Combine(webRootPath, "uploads");
        if (!Directory.Exists(uploads))
        {
            logger.LogInformation("Aucun dossier uploads à vider.");
            return;
        }

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

        logger.LogInformation("Contenu de uploads/ vidé.");
    }
}
