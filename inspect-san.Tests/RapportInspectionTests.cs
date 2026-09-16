using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Services;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Tests;

public class RapportInspectionTests
{
    private static void SetValidee(Mission m, string etat = EtatBatiment.Bon, DateTime? valideeLe = null)
    {
        m.StatutFiche = FicheStatuts.Validee;
        m.EtatBatiment = etat;
        m.NbreBatiment = 1;
        m.NbrEleve = 50;
        m.ValideeLe = valideeLe ?? DateTime.UtcNow;
        m.RecommandationPreliminaire = "Maintien";
    }

    [Fact]
    public async Task SousProvinces_Seed_AvecCodesSP()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var codes = await db.SousProvinces.AsNoTracking().OrderBy(s => s.Code).Select(s => s.Code).ToListAsync();
        codes.Should().Contain("SP001");
        codes.Should().HaveCount(SousProvinceCatalog.Rows.Count);
        (await db.Ecoles.AsNoTracking().AnyAsync(e => e.SousDivision.StartsWith("SP"))).Should().BeTrue();
        (await db.Ecoles.AsNoTracking().AnyAsync(e => e.SousDivision.Contains("kinsenso"))).Should().BeFalse();
    }

    [Fact]
    public async Task GetRapportInspection_FiltreSousDivision_RetourneUniquementEcolesDeLaSd()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var ecole = await db.Ecoles.AsNoTracking().FirstAsync(e => e.SousDivision == SousDivision.Kinsenso1);
        var mission = await db.Missions.FirstAsync(m => m.NumAgrement == ecole.NumAgrement);
        SetValidee(mission);
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(new RapportInspectionFilterDto { Sousproved = "SP001" });

        dto.Sections.Should().HaveCount(1);
        dto.Sections[0].SousDivisionCode.Should().Be("SP001");
        dto.Sections[0].Lignes.Should().NotBeEmpty();
        var ecolesSd = await db.Ecoles.AsNoTracking()
            .Where(e => e.SousDivision == "SP001")
            .Select(e => e.Denomination)
            .ToListAsync();
        dto.Sections[0].Lignes.Select(l => l.EcoleNom).Should().BeSubsetOf(ecolesSd);
    }

    [Fact]
    public async Task GetRapportInspection_SansSousDivision_Vide()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(new RapportInspectionFilterDto());
        dto.Sections.Should().BeEmpty();
    }

    [Fact]
    public async Task GetRapportInspection_ExclutFichesNonValidees()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).FirstAsync(m => m.Ecole != null);
        mission.StatutFiche = FicheStatuts.Brouillon;
        mission.ValideeLe = null;
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(new RapportInspectionFilterDto
        {
            Sousproved = mission.Ecole!.SousDivision
        });

        var nums = dto.Sections.SelectMany(s => s.Lignes).Select(l => l.NumOrdre).ToList();
        nums.Should().NotContain(mission.NumOrdre);
    }

    [Fact]
    public async Task GetRapportInspection_Controleur_NeVoitQueSesMissions()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var missions = await db.Missions.Include(m => m.Ecole).Include(m => m.Affectations).ToListAsync();
        foreach (var m in missions)
            SetValidee(m);
        await db.SaveChangesAsync();

        var sd = missions.First(m => m.Affectations.Any(a => a.MatrAgent == "agt-001")).Ecole!.SousDivision;
        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(
            new RapportInspectionFilterDto { Sousproved = sd },
            role: DataScope.RoleControleur,
            agentId: "agt-001");

        dto.Sections.SelectMany(s => s.Lignes).Should().NotBeEmpty();
        foreach (var ligne in dto.Sections.SelectMany(s => s.Lignes))
        {
            var m = missions.First(x => x.NumOrdre == ligne.NumOrdre);
            m.Affectations.Any(a => a.MatrAgent == "agt-001").Should().BeTrue();
        }
    }

    [Fact]
    public async Task DeposerRapportEquipe_UneFois_PuisRefuse()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).Include(m => m.Affectations)
            .FirstAsync(m => m.Affectations.Any(a => a.MatrAgent == "agt-001"));
        SetValidee(mission);
        await db.SaveChangesAsync();
        var sd = mission.Ecole!.SousDivision;
        var sut = new StatistiquesService(db);

        (await sut.DeposerRapportEquipeAsync(sd, "usr-c", "agt-001")).Success.Should().BeTrue();
        (await sut.DeposerRapportEquipeAsync(sd, "usr-c", "agt-001")).Success.Should().BeFalse();
    }

    [Fact]
    public async Task TransfertSecretariat_EtapeRetiree()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).Include(m => m.Affectations)
            .FirstAsync(m => m.Affectations.Any(a => a.MatrAgent == "agt-001"));
        SetValidee(mission);
        await db.SaveChangesAsync();
        var sd = mission.Ecole!.SousDivision;
        var sut = new StatistiquesService(db);

        var refused = await sut.DeposerRapportSecretariatAsync(sd, "usr-sec");
        refused.Success.Should().BeFalse();
        refused.Message.Should().Contain("Étape retirée");
    }

    [Fact]
    public async Task DepotEquipe_PoseFlagsEtDebloqueDecision()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).Include(m => m.Affectations)
            .FirstAsync(m => m.Affectations.Any(a => a.MatrAgent == "agt-001"));
        SetValidee(mission);
        db.Decisions.RemoveRange(await db.Decisions.Where(d => d.NumOrdre == mission.NumOrdre).ToListAsync());
        await db.SaveChangesAsync();
        var sd = mission.Ecole!.SousDivision;
        var stats = new StatistiquesService(db);
        var decisions = new DecisionsService(db, users);

        (await stats.DeposerRapportEquipeAsync(sd, "usr-c", "agt-001")).Success.Should().BeTrue();
        var reloaded = await db.Missions.AsNoTracking().FirstAsync(m => m.Id == mission.Id);
        reloaded.RapportEquipeDeposeLe.Should().NotBeNull();
        reloaded.RapportSecretariatDeposeLe.Should().NotBeNull();

        var list = await decisions.FichesSansDecisionAsync();
        list.Should().Contain(f => f.Id == mission.Id);
        (await decisions.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = mission.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002")).Success.Should().BeTrue();
    }

    [Fact]
    public async Task TransfertEtCloture_EtapesRetirees_ApresDepot()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).Include(m => m.Affectations)
            .FirstAsync(m => m.Affectations.Any(a => a.MatrAgent == "agt-001"));
        SetValidee(mission);
        await db.SaveChangesAsync();
        var sd = mission.Ecole!.SousDivision;
        var sut = new StatistiquesService(db);

        (await sut.DeposerRapportEquipeAsync(sd, "usr-c", "agt-001")).Success.Should().BeTrue();
        (await sut.DeposerRapportSecretariatAsync(sd, "usr-sec")).Success.Should().BeFalse();
        (await sut.CloturerRapportAsync(sd, "usr-sec")).Success.Should().BeFalse();
        (await sut.DeposerRapportEquipeAsync(sd, "usr-c", "agt-001")).Success.Should().BeFalse();
    }

    [Fact]
    public async Task Cloturer_EtapeRetiree()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Ecole).FirstAsync();
        SetValidee(mission);
        await db.SaveChangesAsync();
        var sut = new StatistiquesService(db);
        var result = await sut.CloturerRapportAsync(mission.Ecole!.SousDivision, "usr-sec");
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Étape retirée");
    }

    [Fact]
    public async Task GetRapportInspection_TauxConformite_CoherentAvecStatistiques()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var ecole = await db.Ecoles.AsNoTracking().FirstAsync();
        var m1 = await db.Missions.FirstAsync(m => m.NumAgrement == ecole.NumAgrement);
        SetValidee(m1, EtatBatiment.Bon);

        var m2 = new Mission
        {
            Id = "mis-rap-t2",
            NumOrdre = "OM-RAP-002",
            NumAgrement = ecole.NumAgrement,
            Validite = MissionStatuts.Cloture,
            NomEquipe = "Equipe-RAP",
            StatutFiche = FicheStatuts.Validee,
            EtatBatiment = EtatBatiment.Critique,
            NbreBatiment = 1,
            NbrEleve = 10,
            ValideeLe = DateTime.UtcNow,
            RecommandationPreliminaire = "Fermeture"
        };
        db.Missions.Add(m2);
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(new RapportInspectionFilterDto { Sousproved = ecole.SousDivision });
        dto.Sections.Should().HaveCount(1);
        dto.Sections[0].FichesCount.Should().BeGreaterThanOrEqualTo(2);
        dto.Sections[0].TauxConformite.Should().BeInRange(0, 100);
    }

    [Fact]
    public async Task GetRapportInspection_LigneContientDecisionSiExiste()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var fiche = await TestDbExtensions.EnsureFicheSansDecisionAsync(db);
        var mission = await db.Missions.Include(m => m.Ecole).FirstAsync(m => m.Id == fiche.Id);
        SetValidee(mission);
        db.Decisions.Add(new Decision
        {
            NumDecision = "DEC-RAP-1",
            NumOrdre = mission.NumOrdre,
            NumAgrement = mission.NumAgrement,
            DecisionFin = DecisionTypes.FermetureTemporaire
        });
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetRapportInspectionAsync(new RapportInspectionFilterDto
        {
            Sousproved = mission.Ecole!.SousDivision
        });
        dto.Sections.SelectMany(s => s.Lignes)
            .First(l => l.NumOrdre == mission.NumOrdre)
            .DecisionLabel.Should().NotBe("—");
    }
}
