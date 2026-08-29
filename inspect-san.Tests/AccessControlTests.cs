using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.DTOs;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Tests;

public class AccessControlTests
{
    public static IEnumerable<object[]> PageMatrix()
    {
        var roles = new[]
        {
            "Administrateur système",
            "Directeur Provincial",
            "Contrôleur",
            "Agent du Secrétariat",
            "Chef d'établissement"
        };
        var pages = new[]
        {
            "dashboard", "ecoles", "chefs", "agents", "utilisateurs", "missions", "fiches",
            "decisions", "statistiques", "rapport", "parametres", "journal", "espace-chef"
        };

        bool Expected(string role, string page) => role switch
        {
            "Administrateur système" => page is not "espace-chef",
            "Directeur Provincial" => page is "dashboard" or "ecoles" or "chefs" or "agents"
                or "missions" or "fiches" or "decisions" or "statistiques" or "rapport",
            "Contrôleur" => page is "dashboard"
                or "missions" or "fiches" or "decisions" or "rapport",
            "Agent du Secrétariat" => page is "dashboard" or "ecoles" or "chefs" or "agents"
                or "missions" or "fiches" or "decisions" or "statistiques" or "rapport" or "parametres",
            "Chef d'établissement" => false,
            _ => false
        };

        foreach (var role in roles)
        foreach (var page in pages)
            yield return new object[] { role, page, Expected(role, page) };
    }

    [Theory]
    [MemberData(nameof(PageMatrix))]
    public void CanAccess_MatchesOfficialMatrix(string role, string page, bool expected)
        => AccessControl.CanAccess(role, page).Should().Be(expected);

    [Theory]
    [InlineData("Directeur Provincial", AccessActions.SignerMission, true)]
    [InlineData("Administrateur système", AccessActions.SignerMission, true)]
    [InlineData("Contrôleur", AccessActions.SignerMission, false)]
    [InlineData("Contrôleur", AccessActions.CreerFiche, true)]
    [InlineData("Contrôleur", AccessActions.ValiderFiche, true)]
    [InlineData("Chef d'établissement", AccessActions.CreerFiche, false)]
    [InlineData("Chef d'établissement", AccessActions.ValiderFiche, false)]
    [InlineData("Directeur Provincial", AccessActions.CreerDecision, true)]
    [InlineData("Agent du Secrétariat", AccessActions.CreerDecision, false)]
    [InlineData("Contrôleur", AccessActions.CreerDecision, false)]
    [InlineData("Chef d'établissement", AccessActions.CreerDecision, false)]
    [InlineData("Chef d'établissement", AccessActions.GererEcole, false)]
    [InlineData("Administrateur système", AccessActions.GererEcole, true)]
    [InlineData("Administrateur système", AccessActions.GererChefs, true)]
    [InlineData("Directeur Provincial", AccessActions.GererEcole, false)]
    [InlineData("Directeur Provincial", AccessActions.GererChefs, false)]
    [InlineData("Directeur Provincial", AccessActions.GererAgents, false)]
    [InlineData("Directeur Provincial", AccessActions.GererParametres, false)]
    [InlineData("Agent du Secrétariat", AccessActions.GererEcole, true)]
    [InlineData("Agent du Secrétariat", AccessActions.GererChefs, true)]
    [InlineData("Agent du Secrétariat", AccessActions.GererAgents, true)]
    [InlineData("Agent du Secrétariat", AccessActions.GererParametres, true)]
    [InlineData("Agent du Secrétariat", AccessActions.GererMission, false)]
    [InlineData("Contrôleur", AccessActions.GererEcole, false)]
    [InlineData("Contrôleur", AccessActions.GererChefs, false)]
    [InlineData("Contrôleur", AccessActions.GererAgents, false)]
    [InlineData("Contrôleur", AccessActions.GererParametres, false)]
    [InlineData("Administrateur système", AccessActions.GererAgents, true)]
    [InlineData("Administrateur système", AccessActions.GererParametres, true)]
    public void CanDo_MatchesActionRules(string role, string action, bool expected)
        => AccessControl.CanDo(role, action).Should().Be(expected);
}

public class AuthorizationFlowTests
{
    [Fact]
    public void Secretariat_Dp_Controleur_PagesLectureEtEcriture()
    {
        AccessControl.CanAccess("Agent du Secrétariat", "ecoles").Should().BeTrue();
        AccessControl.CanAccess("Agent du Secrétariat", "chefs").Should().BeTrue();
        AccessControl.CanAccess("Agent du Secrétariat", "agents").Should().BeTrue();
        AccessControl.CanAccess("Agent du Secrétariat", "missions").Should().BeTrue();
        AccessControl.CanAccess("Agent du Secrétariat", "fiches").Should().BeTrue();
        AccessControl.CanAccess("Agent du Secrétariat", "parametres").Should().BeTrue();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.GererEcole).Should().BeTrue();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.GererChefs).Should().BeTrue();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.GererAgents).Should().BeTrue();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.GererParametres).Should().BeTrue();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.CreerDecision).Should().BeFalse();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.GererMission).Should().BeFalse();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.CreerFiche).Should().BeFalse();

        AccessControl.CanAccess("Directeur Provincial", "ecoles").Should().BeTrue();
        AccessControl.CanAccess("Directeur Provincial", "chefs").Should().BeTrue();
        AccessControl.CanAccess("Directeur Provincial", "agents").Should().BeTrue();
        AccessControl.CanAccess("Directeur Provincial", "fiches").Should().BeTrue();
        AccessControl.CanAccess("Directeur Provincial", "parametres").Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.GererEcole).Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.GererChefs).Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.GererAgents).Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.CreerDecision).Should().BeTrue();

        AccessControl.CanAccess("Contrôleur", "ecoles").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "chefs").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "agents").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "statistiques").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "parametres").Should().BeFalse();
        AccessControl.CanAccess("Contrôleur", "decisions").Should().BeTrue();
        AccessControl.CanDo("Contrôleur", AccessActions.GererEcole).Should().BeFalse();
        AccessControl.CanDo("Contrôleur", AccessActions.CreerDecision).Should().BeFalse();
    }

    [Fact]
    public void Controleur_Cannot_GererMission_Or_Signer()
    {
        AccessControl.CanDo("Contrôleur", AccessActions.GererMission).Should().BeFalse();
        AccessControl.CanDo("Contrôleur", AccessActions.SignerMission).Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.GererMission).Should().BeTrue();
        AccessControl.CanDo("Directeur Provincial", AccessActions.SignerMission).Should().BeTrue();
    }

    [Fact]
    public async Task Controleur_AvecDroitEcriture_PeutValiderFiche_ViaTablette()
    {
        AccessControl.CanDo("Chef d'établissement", AccessActions.ValiderFiche).Should().BeFalse();
        AccessControl.CanDo("Contrôleur", AccessActions.ValiderFiche).Should().BeTrue();

        var (db, users) = await TestDb.CreateSeededAsync();
        var enAttente = await db.Missions
            .FirstOrDefaultAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);
        if (enAttente == null)
        {
            enAttente = await db.Missions.FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
            enAttente.StatutFiche = FicheStatuts.EnAttenteValidation;
            await db.SaveChangesAsync();
        }

        var sut = new FichesControleService(db, users,
            scope: new FixedUserScope(new UserDataScope { AgentId = "agt-001" }),
            access: new MissionAccessService(db));
        var ok = await sut.ValiderAsync(enAttente.Id, "usr-003");
        ok.Success.Should().BeTrue();
        ok.Message.Should().Contain("Lu et approuvé");
    }

    [Fact]
    public async Task Decision_CreatesDecision_OnFicheValidee()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);

        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            EcoleId = fiche.EcoleId,
            TypeDecision = DecisionTypes.FermetureTemporaire
        }, "usr-002");

        result.Success.Should().BeTrue();
        (await db.Decisions.AnyAsync(d => d.NumOrdre == fiche.Numero)).Should().BeTrue();
    }

    [Fact]
    public void Seuls_Admin_Et_Dp_PeuventCreerDecision()
    {
        AccessControl.CanDo("Chef d'établissement", AccessActions.CreerDecision).Should().BeFalse();
        AccessControl.CanDo("Contrôleur", AccessActions.CreerDecision).Should().BeFalse();
        AccessControl.CanDo("Agent du Secrétariat", AccessActions.CreerDecision).Should().BeFalse();
        AccessControl.CanDo("Directeur Provincial", AccessActions.CreerDecision).Should().BeTrue();
        AccessControl.CanDo("Administrateur système", AccessActions.CreerDecision).Should().BeTrue();
    }

    [Fact]
    public void Controleur_CanCreerFiche_Chef_Cannot()
    {
        AccessControl.CanDo("Contrôleur", AccessActions.CreerFiche).Should().BeTrue();
        AccessControl.CanDo("Chef d'établissement", AccessActions.CreerFiche).Should().BeFalse();
    }

    [Fact]
    public void RoleChef_PlusDansRoleAccess_LandingHome()
    {
        AccessControl.CanAccess("Chef d'établissement", "espace-chef").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "ecoles").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "fiches").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "decisions").Should().BeFalse();
        AccessControl.CanAccess("Chef d'établissement", "dashboard").Should().BeFalse();

        AccessControl.RoleAccess.ContainsKey("Chef d'établissement").Should().BeFalse();
        AccessControl.CanDo("Administrateur système", AccessActions.GererEcole).Should().BeTrue();
        AccessControl.CanDo("Chef d'établissement", AccessActions.GererEcole).Should().BeFalse();

        AccessControl.DefaultLanding("Chef d'établissement").Should().Be(("Home", "Index"));
        AccessControl.DefaultLanding("Administrateur système").Should().Be(("Home", "Index"));
    }
}

public class DataScopeTests
{
    [Fact]
    public void Admin_IsUnrestricted()
    {
        var scope = DataScope.Resolve("Administrateur système", "usr-001");
        scope.Unrestricted.Should().BeTrue();
        scope.AllowsEcole("eco-999").Should().BeTrue();
    }

    [Fact]
    public void Secretariat_IsUnrestricted()
    {
        DataScope.Resolve("Agent du Secrétariat", "usr-005").Unrestricted.Should().BeTrue();
    }

    [Fact]
    public void Controleur_ScopedByAgentId()
    {
        var scope = DataScope.Resolve("Contrôleur", "usr-003", userAgentId: "agt-001");
        scope.Unrestricted.Should().BeFalse();
        scope.AgentId.Should().Be("agt-001");
        scope.AllowsMission(["agt-001", "agt-002"], "eco-001").Should().BeTrue();
        scope.AllowsMission(["agt-002"], "eco-001").Should().BeFalse();
    }

    [Fact]
    public void RoleChef_Legacy_SeesNothing()
    {
        var scope = DataScope.Resolve("Chef d'établissement", "usr-006", "eco-001");
        scope.IsEmpty.Should().BeTrue();
        scope.AllowsEcole("eco-001").Should().BeFalse();
        scope.AllowsDecision("eco-001").Should().BeFalse();
        scope.AllowsFiche(null, "eco-001", null, "mis-x").Should().BeFalse();
    }

    [Fact]
    public void RoleChef_WithoutEcoleId_SeesNothing()
    {
        var scope = DataScope.Resolve("Chef d'établissement", "usr-006", null);
        scope.IsEmpty.Should().BeTrue();
        scope.AllowsEcole("eco-001").Should().BeFalse();
    }

    [Fact]
    public async Task Controleur_ListMissions_OnlyWhereParticipates()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var agentId = await db.Affectations.AsNoTracking().Select(p => p.MatrAgent).FirstAsync();
        var agent = await db.Agents.AsNoTracking().FirstAsync(a => a.MatrAgent == agentId);
        var scope = DataScope.Resolve("Contrôleur", "usr-003", userAgentId: agent.MatrAgent);

        var missions = await db.Missions.AsNoTracking()
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .ToListAsync();

        var mine = missions.Where(m =>
            scope.AllowsMission(m.Affectations.Select(p => p.MatrAgent), m.Ecole?.Id ?? "")).ToList();
        var others = missions.Where(m =>
            !scope.AllowsMission(m.Affectations.Select(p => p.MatrAgent), m.Ecole?.Id ?? "")).ToList();

        mine.Should().OnlyContain(m => m.Affectations.Any(p => p.MatrAgent == agent.MatrAgent));
        if (others.Count > 0)
            others.Should().OnlyContain(m => m.Affectations.All(p => p.MatrAgent != agent.MatrAgent));
    }

    [Fact]
    public async Task Admin_Dashboard_SeesAllEcoles_Controleur_SeesScoped()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DashboardService(db, users);
        var admin = await sut.GetDashboardAsync("Administrateur système", "usr-001");
        var controleur = await sut.GetDashboardAsync("Contrôleur", "usr-003", userAgentId: "agt-001");

        admin.EcolesCount.Should().BeGreaterThan(1);
        controleur.EcolesCount.Should().BeGreaterThan(0);
        controleur.EcolesCount.Should().BeLessThanOrEqualTo(admin.EcolesCount);
    }
}
