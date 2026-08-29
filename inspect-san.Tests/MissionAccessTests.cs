using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.DTOs;
using inspect_san.Services;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Tests;

public class MissionAccessTests
{
    private static FixedUserScope ScopeAgent(string agentId)
        => new(new UserDataScope { AgentId = agentId });

    private static MissionsService Missions(
        Models.Data.InspectSanDbContext db,
        Services.Mock.MockUserStore users,
        ICurrentUserScope? scope = null)
        => new(db, users, scope: scope, access: new MissionAccessService(db));

    private static async Task<string> FirstEcoleIdAsync(Models.Data.InspectSanDbContext db)
        => (await db.Ecoles.AsNoTracking().OrderBy(e => e.Id).FirstAsync()).Id;

    private static SaveMissionDto BaseSave(string ecoleId, params (string agent, string role)[] parts)
        => new()
        {
            EcoleId = ecoleId,
            Statut = MissionStatuts.Brouillon,
            Participations = parts.Select(p => new SaveParticipationDto
            {
                AgentId = p.agent,
                RoleMission = p.role
            }).ToList()
        };

    [Fact]
    public async Task SaveMission_Refuse_DeuxChefsEquipe()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var ecoleId = await FirstEcoleIdAsync(db);
        var sut = Missions(db, users);

        var result = await sut.SaveAsync(BaseSave(ecoleId,
            ("agt-001", RolesMissionCodes.ChefEquipe),
            ("agt-002", RolesMissionCodes.ChefEquipe)));

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("un seul chef d'équipe");
    }

    [Fact]
    public async Task SaveMission_Refuse_DeuxChefsAdjoints()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var ecoleId = await FirstEcoleIdAsync(db);
        var sut = Missions(db, users);

        var result = await sut.SaveAsync(BaseSave(ecoleId,
            ("agt-001", RolesMissionCodes.ChefEquipe),
            ("agt-002", RolesMissionCodes.ChefAdjoint),
            ("agt-003", RolesMissionCodes.ChefAdjoint)));

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("un seul chef adjoint");
    }

    [Fact]
    public async Task SaveMission_Refuse_AgentEnDouble()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var ecoleId = await FirstEcoleIdAsync(db);
        var sut = Missions(db, users);

        var result = await sut.SaveAsync(BaseSave(ecoleId,
            ("agt-001", RolesMissionCodes.ChefEquipe),
            ("agt-001", RolesMissionCodes.Membre)));

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("une fois");
    }

    [Fact]
    public async Task SaveMission_Accepte_UnChef_UnAdjoint_PlusieursMembres()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var ecoleId = await FirstEcoleIdAsync(db);
        var sut = Missions(db, users);

        var result = await sut.SaveAsync(BaseSave(ecoleId,
            ("agt-001", RolesMissionCodes.ChefEquipe),
            ("agt-002", RolesMissionCodes.ChefAdjoint),
            ("agt-003", RolesMissionCodes.Membre),
            ("agt-004", RolesMissionCodes.Membre)));

        result.Success.Should().BeTrue();
        var created = await db.Missions.Include(m => m.Affectations)
            .OrderByDescending(m => m.CreatedAt).FirstAsync();
        created.Affectations.Should().HaveCount(4);
        created.Affectations.Count(a => a.Fonction == RolesMissionCodes.ChefEquipe).Should().Be(1);
        created.Affectations.Count(a => a.Fonction == RolesMissionCodes.ChefAdjoint).Should().Be(1);
        created.Affectations.Count(a => a.Fonction == RolesMissionCodes.Membre).Should().Be(2);
    }

    [Fact]
    public async Task Controleur_NeVoitQueSesMissions()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        // Seed missions all include agt-001. Add mission without agt-005.
        var ecole = await db.Ecoles.FirstAsync();
        db.Missions.Add(new Models.Entities.Mission
        {
            Id = "mis-isol",
            NumOrdre = "OM-TEST-ISO",
            NumAgrement = ecole.NumAgrement,
            NomEquipe = "Equipe-ISO",
            Validite = MissionStatuts.Brouillon,
            CreatedAt = DateTime.UtcNow,
            Affectations =
            [
                new() { NomOrdre = "OM-TEST-ISO", MatrAgent = "agt-005", Fonction = RolesMissionCodes.ChefEquipe }
            ]
        });
        await db.SaveChangesAsync();

        var sut = Missions(db, users, ScopeAgent("agt-005"));
        var list = await sut.ListAsync(new MissionFilterDto());

        list.Should().NotBeEmpty();
        list.Should().OnlyContain(m => m.Participations.Any(p => p.AgentId == "agt-005"));
        list.Should().Contain(m => m.Id == "mis-isol");
    }

    [Fact]
    public async Task Membre_NePeutPasModifierMission()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations).Include(m => m.Ecole)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture);
        mission.Affectations.Add(new Models.Entities.Affectation
        {
            NomOrdre = mission.NumOrdre,
            MatrAgent = "agt-003",
            Fonction = RolesMissionCodes.Membre
        });
        await db.SaveChangesAsync();

        var access = new MissionAccessService(db);
        (await access.CanWriteMissionAsync(mission.Id, "agt-003", false)).Should().BeFalse();

        var sut = Missions(db, users, ScopeAgent("agt-003"));
        var result = await sut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = mission.Ecole!.Id,
            Statut = mission.Statut,
            Participations = mission.Affectations.Select(a => new SaveParticipationDto
            {
                AgentId = a.MatrAgent,
                RoleMission = a.Fonction
            }).ToList()
        });
        result.Success.Should().BeFalse();
        result.Message.Should().Contain("droit");
    }

    [Fact]
    public async Task ChefEquipe_PeutModifierMission()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture);

        var access = new MissionAccessService(db);
        (await access.CanWriteMissionAsync(mission.Id, "agt-001", false)).Should().BeTrue();

        var sut = Missions(db, users, ScopeAgent("agt-001"));
        var parts = mission.Affectations.Select(a => new SaveParticipationDto
        {
            AgentId = a.MatrAgent,
            RoleMission = a.Fonction
        }).ToList();
        var result = await sut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = mission.Ecole!.Id,
            Statut = mission.Statut,
            Objet = "Objet modifié test",
            Participations = parts
        });
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task Adjoint_SansDelegation_NePeutPasModifier()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations).Include(m => m.Ecole)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture);
        var adjoint = mission.Affectations.First(a => a.Fonction == RolesMissionCodes.ChefAdjoint);
        adjoint.EcritureDeleguee = false;
        await db.SaveChangesAsync();

        var access = new MissionAccessService(db);
        (await access.CanWriteMissionAsync(mission.Id, "agt-002", false)).Should().BeFalse();

        var sut = Missions(db, users, ScopeAgent("agt-002"));
        var result = await sut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = mission.Ecole!.Id,
            Participations = mission.Affectations.Select(a => new SaveParticipationDto
            {
                AgentId = a.MatrAgent,
                RoleMission = a.Fonction
            }).ToList()
        });
        result.Success.Should().BeFalse();
    }

    [Fact]
    public async Task ChefEquipe_DelegueEcriture_AdjointPeutModifier()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture);

        var chefSut = Missions(db, users, ScopeAgent("agt-001"));
        var deleg = await chefSut.DeleguerEcritureAdjointAsync(mission.Id, "usr-chef");
        deleg.Success.Should().BeTrue();

        var access = new MissionAccessService(db);
        (await access.CanWriteMissionAsync(mission.Id, "agt-002", false)).Should().BeTrue();

        var adjointSut = Missions(db, users, ScopeAgent("agt-002"));
        var result = await adjointSut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = mission.Ecole!.Id,
            Participations = mission.Affectations.Select(a => new SaveParticipationDto
            {
                AgentId = a.MatrAgent,
                RoleMission = a.Fonction
            }).ToList()
        });
        result.Success.Should().BeTrue();
    }

    [Fact]
    public async Task ChefEquipe_RetireDelegation_AdjointNePeutPlusModifier()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations).Include(m => m.Ecole)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture);

        var chefSut = Missions(db, users, ScopeAgent("agt-001"));
        (await chefSut.DeleguerEcritureAdjointAsync(mission.Id, "usr-chef")).Success.Should().BeTrue();
        (await chefSut.RetirerDelegationAdjointAsync(mission.Id, "usr-chef")).Success.Should().BeTrue();

        var access = new MissionAccessService(db);
        (await access.CanWriteMissionAsync(mission.Id, "agt-002", false)).Should().BeFalse();
    }

    [Fact]
    public async Task Delegation_EstJournalisee()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.FirstAsync(m => m.Validite != MissionStatuts.Cloture);
        var sut = Missions(db, users, ScopeAgent("agt-001"));

        await sut.DeleguerEcritureAdjointAsync(mission.Id, "usr-chef");
        await sut.RetirerDelegationAdjointAsync(mission.Id, "usr-chef");

        var journals = users.JournalActivite;
        journals.Should().Contain(j => j.Action.Contains("délégation", StringComparison.OrdinalIgnoreCase)
                                       || j.Detail.Contains("cédée", StringComparison.OrdinalIgnoreCase));
        journals.Should().Contain(j => j.Action.Contains("retrait", StringComparison.OrdinalIgnoreCase)
                                       || j.Detail.Contains("retirée", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task Dp_Unrestricted_NePeutPasDeleguerNiRetirer()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture
                             && m.Affectations.Any(a => a.Fonction == RolesMissionCodes.ChefAdjoint));

        var dp = Missions(db, users, new FixedUserScope(new UserDataScope { Unrestricted = true }));
        (await dp.DeleguerEcritureAdjointAsync(mission.Id, "usr-dp")).Success.Should().BeFalse();

        var chef = Missions(db, users, ScopeAgent("agt-001"));
        (await chef.DeleguerEcritureAdjointAsync(mission.Id, "usr-chef")).Success.Should().BeTrue();
        (await dp.RetirerDelegationAdjointAsync(mission.Id, "usr-dp")).Success.Should().BeFalse();
    }

    [Fact]
    public async Task Membre_Et_Adjoint_NePeuventPasDeleguer()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture
                             && m.Affectations.Any(a => a.Fonction == RolesMissionCodes.ChefAdjoint));

        var adjointId = mission.Affectations.First(a => a.Fonction == RolesMissionCodes.ChefAdjoint).MatrAgent;
        (await Missions(db, users, ScopeAgent(adjointId))
            .DeleguerEcritureAdjointAsync(mission.Id, "usr-adj")).Success.Should().BeFalse();

        var membre = mission.Affectations.FirstOrDefault(a => a.Fonction == RolesMissionCodes.Membre);
        if (membre != null)
        {
            (await Missions(db, users, ScopeAgent(membre.MatrAgent))
                .DeleguerEcritureAdjointAsync(mission.Id, "usr-membre")).Success.Should().BeFalse();
        }
    }

    [Fact]
    public async Task CanDeleguer_UniquementChefEquipeAffecte()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.Include(m => m.Affectations)
            .FirstAsync(m => m.Validite != MissionStatuts.Cloture
                             && m.Affectations.Any(a => a.Fonction == RolesMissionCodes.ChefAdjoint)
                             && m.Affectations.Any(a => a.Fonction == RolesMissionCodes.ChefEquipe));

        var dpList = await Missions(db, users, new FixedUserScope(new UserDataScope { Unrestricted = true }))
            .ListAsync(new MissionFilterDto());
        dpList.First(m => m.Id == mission.Id).CanDeleguer.Should().BeFalse();

        var chefList = await Missions(db, users, ScopeAgent("agt-001"))
            .ListAsync(new MissionFilterDto());
        chefList.First(m => m.Id == mission.Id).CanDeleguer.Should().BeTrue();
    }

    [Fact]
    public async Task ValiderFiche_ViaCircuitTablette_SansRoleChef()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var fiche = await db.FichesQuery().Include(m => m.Affectations)
            .FirstAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);

        AccessControl.CanDo("Chef d'établissement", AccessActions.ValiderFiche).Should().BeFalse();
        AccessControl.CanDo("Contrôleur", AccessActions.ValiderFiche).Should().BeTrue();

        var sut = new FichesControleService(db, users,
            scope: ScopeAgent("agt-001"),
            access: new MissionAccessService(db));
        var ok = await sut.ValiderAsync(fiche.Id, "usr-controleur");
        ok.Success.Should().BeTrue();
        ok.Message.Should().Contain("Lu et approuvé");
    }

    [Fact]
    public void AccessControl_RoleChef_PlusAccessible()
    {
        AccessControl.CanAccess("Chef d'établissement", "espace-chef").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "dashboard").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "fiches").Should().BeFalse();
        AccessControl.RoleAccess.ContainsKey("Chef d'établissement").Should().BeFalse();
        AccessControl.CanDo("Chef d'établissement", AccessActions.ValiderFiche).Should().BeFalse();
        AccessControl.DefaultLanding("Chef d'établissement").Should().Be(("Home", "Index"));
        AccessControl.DefaultLanding("Contrôleur").Should().Be(("Home", "Index"));
    }
}
