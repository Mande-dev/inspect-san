using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Tests;

internal static class TestDbExtensions
{
    public static IQueryable<Mission> FichesQuery(this InspectSanDbContext db)
        => db.Missions.Where(m => m.StatutFiche != null);

    public static async Task<string> EcoleIdForMissionAsync(this InspectSanDbContext db, Mission m)
    {
        if (m.Ecole != null) return m.Ecole.Id;
        return (await db.Ecoles.AsNoTracking().FirstAsync(e => e.NumAgrement == m.NumAgrement)).Id;
    }

    public static async Task<FicheControle> EnsureFicheSansDecisionAsync(InspectSanDbContext db)
    {
        var existing = await db.Missions
            .Include(m => m.Ecole)
            .FirstOrDefaultAsync(m => m.StatutFiche == FicheStatuts.Validee
                                      && !db.Decisions.Any(d => d.NumOrdre == m.NumOrdre));
        if (existing != null)
            return FicheControle.FromMission(existing, await db.EcoleIdForMissionAsync(existing));

        var mission = await db.Missions
            .Include(m => m.Ecole)
            .FirstAsync(m => m.Validite == MissionStatuts.EnCours || m.Validite == MissionStatuts.Signe);
        mission.StatutFiche = FicheStatuts.Validee;
        mission.NbreBatiment = 2;
        mission.EtatBatiment = EtatBatiment.Bon;
        mission.NbrEleve = 100;
        mission.NbrToiletteFille = 2;
        mission.NbrToiletteGarcon = 2;
        mission.RecommandationPreliminaire = "Maintien";
        mission.ValideePar = "usr-003";
        mission.ValideeLe = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return FicheControle.FromMission(mission, await db.EcoleIdForMissionAsync(mission));
    }
}
