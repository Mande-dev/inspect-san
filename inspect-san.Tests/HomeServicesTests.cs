using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace inspect_san.Tests;

internal static class TestDb
{
    public static async Task<(InspectSanDbContext Db, MockUserStore Users)> CreateSeededAsync()
    {
        var options = new DbContextOptionsBuilder<InspectSanDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var db = new InspectSanDbContext(options);
        await DbSeeder.SeedAsync(db);
        return (db, new MockUserStore(db));
    }

    public static async Task<IdentityTestHost> CreateIdentityHostAsync()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddDbContext<InspectSanDbContext>(o =>
            o.UseInMemoryDatabase(Guid.NewGuid().ToString()));
        services
            .AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<InspectSanDbContext>()
            .AddDefaultTokenProviders();

        var provider = services.BuildServiceProvider();
        var scope = provider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        await IdentitySeeder.SeedAsync(userManager, roleManager);
        var db = scope.ServiceProvider.GetRequiredService<InspectSanDbContext>();
        return new IdentityTestHost(provider, scope, userManager, roleManager, db, new MockUserStore(db));
    }

    /// <summary>Fiche validée sans décision (crée une fiche si le seed n'en laisse aucune).</summary>
    public static Task<FicheControle> EnsureFicheSansDecisionAsync(InspectSanDbContext db)
        => TestDbExtensions.EnsureFicheSansDecisionAsync(db);
}

internal sealed class IdentityTestHost : IAsyncDisposable
{
    private readonly ServiceProvider _provider;
    private readonly IServiceScope _scope;

    public IdentityTestHost(
        ServiceProvider provider,
        IServiceScope scope,
        UserManager<ApplicationUser> users,
        RoleManager<IdentityRole> roles,
        InspectSanDbContext db,
        MockUserStore store)
    {
        _provider = provider;
        _scope = scope;
        Users = users;
        Roles = roles;
        Db = db;
        Store = store;
    }

    public UserManager<ApplicationUser> Users { get; }
    public RoleManager<IdentityRole> Roles { get; }
    public InspectSanDbContext Db { get; }
    public MockUserStore Store { get; }

    public ValueTask DisposeAsync()
    {
        _scope.Dispose();
        _provider.Dispose();
        return ValueTask.CompletedTask;
    }
}

public class EcolesServiceTests
{
    [Fact]
    public async Task ListAsync_FilterBySousproved_ReturnsMatching()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new EcolesService(db, users);
        var all = await sut.ListAsync(new EcoleFilterDto());
        var sousproved = all.First().Sousproved;

        var filtered = await sut.ListAsync(new EcoleFilterDto { Sousproved = sousproved });

        filtered.Should().OnlyContain(e => e.Sousproved == sousproved);
        filtered.Should().NotBeEmpty();
    }

    [Fact]
    public async Task SaveAsync_Create_WithSousprovedAndAdresse_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new EcolesService(db, users);
        var regimeCode = RegGes.All.First();
        var sousCode = SousDivision.All.First();
        var catCode = await db.Categories.AsNoTracking().Select(c => c.CodeCategories).FirstAsync();
        var result = await sut.SaveAsync(new SaveEcoleDto
        {
            Denomination = "École Test Unitaire",
            RegGes = regimeCode,
            IdDinacope = "DIN-TEST-UNIT-9999",
            SousDivision = sousCode,
            CodeCategories = catCode,
            Adresse = "Av. Test 1"
        });

        result.Success.Should().BeTrue(result.Message);
        var created = await sut.ListAsync(new EcoleFilterDto { Q = "École Test Unitaire" });
        created.Should().ContainSingle(e => e.IdDinacope == "DIN-TEST-UNIT-9999");
        created[0].SousDivision.Should().Be(sousCode);
        created[0].Adresse.Should().Be("Av. Test 1");
    }

    [Fact]
    public async Task SaveAsync_DuplicateDinacope_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new EcolesService(db, users);
        var existing = (await sut.ListAsync(new EcoleFilterDto())).First();
        var result = await sut.SaveAsync(new SaveEcoleDto
        {
            Denomination = "Autre",
            RegGes = RegGes.All.First(),
            IdDinacope = existing.IdDinacope,
            SousDivision = SousDivision.All.First(),
            CodeCategories = existing.CodeCategories,
            Adresse = "X"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("DINACOPE");
    }

    [Fact]
    public async Task DeleteAsync_WhenLinked_SuggestsDeactivate()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new EcolesService(db, users);
        var linkedId = await db.Missions
            .Join(db.Ecoles, m => m.NumAgrement, e => e.NumAgrement, (m, e) => e.Id)
            .FirstAsync();

        var result = await sut.DeleteAsync(linkedId);

        result.Success.Should().BeFalse();
        result.SuggestDeactivate.Should().BeTrue();
    }
}

public class MissionsServiceTests
{
    [Fact]
    public async Task SaveAsync_Create_WithChefMission_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);

        var result = await sut.SaveAsync(new SaveMissionDto
        {
            EcoleId = "eco-001",
            Objet = "Contrôle test",
            Participations =
            [
                new SaveParticipationDto { AgentId = "agt-001", RoleMission = RolesMissionCodes.ChefEquipe },
                new SaveParticipationDto { AgentId = "agt-002", RoleMission = RolesMissionCodes.Membre }
            ]
        });

        result.Success.Should().BeTrue(result.Message);
        var created = await db.Missions
            .Include(m => m.Affectations)
            .FirstAsync(m => m.Objet == "Contrôle test");
        created.NomEquipe.Should().Be($"Equipe-{created.Numero}");
        created.Affectations.Should().HaveCount(2);
        created.Affectations.Should().Contain(p => p.Fonction == RolesMissionCodes.ChefEquipe);
        created.Statut.Should().Be(MissionStatuts.Brouillon);
        created.MontPer.Should().BeNull();
    }

    [Fact]
    public async Task SaveAsync_Create_IgnoresMontPer_LeavesNull()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);

        var result = await sut.SaveAsync(new SaveMissionDto
        {
            EcoleId = "eco-001",
            Objet = "Mission sans montant UI",
            Participations =
            [
                new SaveParticipationDto { AgentId = "agt-001", RoleMission = RolesMissionCodes.ChefEquipe }
            ]
        });

        result.Success.Should().BeTrue(result.Message);
        var created = await db.Missions.AsNoTracking().FirstAsync(m => m.Objet == "Mission sans montant UI");
        created.MontPer.Should().BeNull();
    }

    [Fact]
    public async Task SaveAsync_Update_PreservesExistingMontPer()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);
        var mission = await db.Missions.FirstAsync(m => m.Validite == MissionStatuts.Brouillon);
        var ecoleId = (await db.Ecoles.AsNoTracking().FirstAsync(e => e.NumAgrement == mission.NumAgrement)).Id;
        mission.MontPer = 75000m;
        await db.SaveChangesAsync();

        var result = await sut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = ecoleId,
            Statut = mission.Statut,
            FinValidite = mission.FinValidite,
            Objet = "Maj sans toucher montant",
            Participations =
            [
                new SaveParticipationDto { AgentId = "agt-001", RoleMission = RolesMissionCodes.ChefEquipe }
            ]
        });

        result.Success.Should().BeTrue(result.Message);
        var updated = await db.Missions.AsNoTracking().FirstAsync(m => m.Id == mission.Id);
        updated.MontPer.Should().Be(75000m);
        updated.Objet.Should().Be("Maj sans toucher montant");
    }

    [Fact]
    public async Task SaveAsync_Update_KeepsNomEquipeFromNumero()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);
        var mission = await db.Missions.AsNoTracking().FirstAsync(m => m.Validite == MissionStatuts.Brouillon);
        var ecoleId = (await db.Ecoles.AsNoTracking().FirstAsync(e => e.NumAgrement == mission.NumAgrement)).Id;
        mission.NomEquipe.Should().StartWith("Equipe-");

        var result = await sut.SaveAsync(new SaveMissionDto
        {
            Id = mission.Id,
            EcoleId = ecoleId,
            Statut = mission.Statut,
            FinValidite = mission.FinValidite,
            Objet = "Maj équipe auto",
            Participations =
            [
                new SaveParticipationDto { AgentId = "agt-001", RoleMission = RolesMissionCodes.ChefEquipe }
            ]
        });

        result.Success.Should().BeTrue(result.Message);
        var updated = await db.Missions.AsNoTracking().FirstAsync(m => m.Id == mission.Id);
        updated.NomEquipe.Should().Be($"Equipe-{updated.Numero}");
        updated.Objet.Should().Be("Maj équipe auto");
    }

    [Fact]
    public async Task SaveAsync_WithoutChefMission_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);

        var result = await sut.SaveAsync(new SaveMissionDto
        {
            EcoleId = "eco-001",
            Participations =
            [
                new SaveParticipationDto { AgentId = "agt-001", RoleMission = RolesMissionCodes.Membre }
            ]
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("chef d'équipe");
    }

    [Fact]
    public async Task DemanderSignature_Signer_PasserEnCours_Cloturer()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);
        var mission = await db.Missions.FirstAsync(m => m.Validite == MissionStatuts.Brouillon);

        (await sut.PasserEnCoursAsync(mission.Id)).Success.Should().BeFalse();
        (await sut.DemanderSignatureAsync(mission.Id, "u")).Success.Should().BeTrue();
        (await sut.SignerAsync(mission.Id, "u")).Success.Should().BeTrue();
        (await sut.PasserEnCoursAsync(mission.Id, "u")).Success.Should().BeTrue();
        (await sut.CloturerAsync(mission.Id, "u")).Success.Should().BeTrue();
        (await db.Missions.FirstAsync(m => m.Id == mission.Id)).Statut.Should().Be(MissionStatuts.Cloture);
    }

    [Fact]
    public async Task DeleteAsync_SignedMission_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new MissionsService(db, users);
        var signe = await db.Missions.FirstAsync(m => m.Validite == MissionStatuts.Signe);

        var result = await sut.DeleteAsync(signe.Id);

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("ne peut plus être retirée");
    }
}

public class FichesControleServiceTests
{
    [Fact]
    public async Task SoumettrePourValidationAsync_Brouillon_ToEnAttente()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var brouillon = await db.FichesQuery().AsNoTracking().FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);

        var result = await sut.SoumettrePourValidationAsync(brouillon.Id, "usr-003");

        result.Success.Should().BeTrue();
        (await db.Missions.FirstAsync(m => m.Id == brouillon.Id)).StatutFiche.Should().Be(FicheStatuts.EnAttenteValidation);
    }

    [Fact]
    public async Task ValiderAsync_FromEnAttente_SetsValidee()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var enAttente = await db.FichesQuery().AsNoTracking()
            .FirstAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);

        var result = await sut.ValiderAsync(enAttente.Id, "usr-006");

        result.Success.Should().BeTrue();
        result.Message.Should().Contain("Lu et approuvé");
        (await db.Missions.FirstAsync(m => m.Id == enAttente.Id)).StatutFiche.Should().Be(FicheStatuts.Validee);
    }

    [Fact]
    public async Task ValiderAsync_FromBrouillon_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var brouillon = await db.FichesQuery().AsNoTracking().FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);

        var result = await sut.ValiderAsync(brouillon.Id, "usr-006");

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("attente");
        (await db.Missions.FirstAsync(m => m.Id == brouillon.Id)).StatutFiche.Should().Be(FicheStatuts.Brouillon);
    }

    [Fact]
    public async Task SaveAsync_Create_OnNonOperationalMission_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var brouillon = await db.Missions.AsNoTracking()
            .FirstAsync(m => m.Validite == MissionStatuts.Brouillon);

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            MissionId = brouillon.Id,
            EtatGeneral = "Satisfaisant",
            RecommandationPreliminaire = "Maintien"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("signée");
    }

    [Fact]
    public async Task SaveAsync_Create_OnSigneMission_WithProduits_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var mission = await db.Missions.AsNoTracking()
            .FirstAsync(m => m.Validite == MissionStatuts.Signe);
        var tracked = await db.Missions.FirstAsync(m => m.Id == mission.Id);
        tracked.StatutFiche = null;
        await db.SaveChangesAsync();

        var produitCodes = await db.Produits.AsNoTracking().Take(2).Select(p => p.CodeProduit).ToArrayAsync();
        var outilCodes = await db.Outils.AsNoTracking().Take(2).Select(o => o.CodeOutile).ToArrayAsync();

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            MissionId = mission.Id,
            EtatGeneral = "Bon",
            RecommandationPreliminaire = "Maintien",
            Observations = "Création test circuit",
            ToilettesFilles = 3,
            ToilettesGarcons = 2,
            
            ProduitsAutres = "Chlore",
            ProduitsAutresQuantite = 4,
            ControleProduits = produitCodes.Select((code, i) => new SaveControleProduitDto
            {
                ProduitCode = code,
                Quantite = 10 + i
            }).ToList(),
            ControleOutils = outilCodes.Select((code, i) => new SaveControleOutilDto
            {
                OutilCode = code,
                Quantite = 2 + i
            }).ToList()
        });

        result.Success.Should().BeTrue(result.Message);
        var ficheMission = await db.Missions
            .Include(m => m.MissionProduits)
            .Include(m => m.MissionOutils)
            .FirstAsync(m => m.Observation == "Création test circuit");
        ficheMission.StatutFiche.Should().Be(FicheStatuts.Brouillon);
        ficheMission.Id.Should().Be(mission.Id);
        ficheMission.NbrToiletteFille.Should().Be(3);
        ficheMission.NbrToiletteGarcon.Should().Be(2);
        
        ficheMission.ProduitsAutres.Should().Be("Chlore");
        ficheMission.ProduitsAutresQuantite.Should().Be(4);
        ficheMission.CodeProduit.Should().Be(produitCodes[0]);
        ficheMission.NbreProduit.Should().Be(produitCodes.Select((_, i) => 10 + i).Sum());
        ficheMission.MissionProduits.Should().HaveCount(produitCodes.Length);
        ficheMission.MissionOutils.Should().HaveCount(outilCodes.Length);
        ficheMission.CodeOutil.Should().Be(outilCodes[0]);
        ficheMission.NbreOutil.Should().Be(outilCodes.Select((_, i) => 2 + i).Sum());
    }

    [Fact]
    public async Task SaveAsync_Create_PersistsMontPerOnMission()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var mission = await db.Missions.AsNoTracking()
            .FirstAsync(m => m.Validite == MissionStatuts.Signe);
        var tracked = await db.Missions.FirstAsync(m => m.Id == mission.Id);
        tracked.StatutFiche = null;
        tracked.MontPer = null;
        await db.SaveChangesAsync();

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            MissionId = mission.Id,
            EtatGeneral = "Satisfaisant",
            RecommandationPreliminaire = "Maintien",
            MontPer = 125000.50m
        });

        result.Success.Should().BeTrue(result.Message);
        var saved = await db.Missions.AsNoTracking().FirstAsync(m => m.Id == mission.Id);
        saved.MontPer.Should().Be(125000.50m);
    }

    [Fact]
    public async Task SaveAsync_Update_PersistsMontPerOnMission()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var fiche = await db.FichesQuery().FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
        fiche.MontPer = 1000m;
        await db.SaveChangesAsync();

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            Id = fiche.Id,
            MissionId = fiche.Id,
            EtatGeneral = fiche.EtatBatiment,
            RecommandationPreliminaire = fiche.RecommandationPreliminaire,
            NombreBatiments = fiche.NbreBatiment,
            NombreEleves = fiche.NbrEleve,
            ToilettesFilles = fiche.NbrToiletteFille,
            ToilettesGarcons = fiche.NbrToiletteGarcon,
            Observations = fiche.Observation,
            MontPer = 99000m
        });

        result.Success.Should().BeTrue(result.Message);
        var saved = await db.Missions.AsNoTracking().FirstAsync(m => m.Id == fiche.Id);
        saved.MontPer.Should().Be(99000m);
    }

    [Fact]
    public async Task SaveAsync_OnEnAttenteValidation_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var enAttente = await db.FichesQuery().AsNoTracking()
            .FirstAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            Id = enAttente.Id,
            MissionId = enAttente.Id,
            Observations = "Tentative de modification après soumission",
            EtatGeneral = "Bon",
            RecommandationPreliminaire = "Maintien"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("soumise");
        (await db.Missions.FirstAsync(m => m.Id == enAttente.Id))
            .Observation.Should().Be(enAttente.Observation);
    }

    [Fact]
    public async Task DeleteAsync_OnEnAttenteValidation_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var enAttente = await db.FichesQuery().AsNoTracking()
            .FirstAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);

        var result = await sut.DeleteAsync(enAttente.Id);

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("ne peut plus être retirée");
        (await db.FichesQuery().AnyAsync(m => m.Id == enAttente.Id)).Should().BeTrue();
    }

    [Fact]
    public async Task SaveAsync_OnBrouillon_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var brouillon = await db.FichesQuery().AsNoTracking()
            .FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);

        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            Id = brouillon.Id,
            MissionId = brouillon.Id,
            Observations = "Modif brouillon OK",
            EtatGeneral = "Satisfaisant",
            RecommandationPreliminaire = "Maintien",
            ToilettesFilles = 2,
            ToilettesGarcons = 2,
            
        });

        result.Success.Should().BeTrue(result.Message);
        var updated = await db.Missions.FirstAsync(m => m.Id == brouillon.Id);
        updated.Observation.Should().Be("Modif brouillon OK");
        updated.NbrToiletteFille.Should().Be(2);
        updated.NbrToiletteGarcon.Should().Be(2);
        
    }

    [Fact]
    public async Task DeleteAsync_OnBrouillon_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var mission = await db.Missions.AsNoTracking()
            .FirstAsync(m => m.Validite == MissionStatuts.Signe || m.Validite == MissionStatuts.EnCours);
        var tracked = await db.Missions.FirstAsync(m => m.Id == mission.Id);
        tracked.StatutFiche = null;
        await db.SaveChangesAsync();
        var create = await sut.SaveAsync(new SaveFicheControleDto
        {
            MissionId = mission.Id,
            EtatGeneral = "Bon",
            RecommandationPreliminaire = "Maintien",
            Observations = "Fiche isolée à supprimer"
        });
        create.Success.Should().BeTrue(create.Message);
        var brouillonId = await db.Missions.AsNoTracking()
            .Where(m => m.Observation == "Fiche isolée à supprimer" && m.StatutFiche == FicheStatuts.Brouillon)
            .Select(m => m.Id)
            .FirstAsync();

        var result = await sut.DeleteAsync(brouillonId);

        result.Success.Should().BeTrue(result.Message);
        (await db.Missions.FirstAsync(m => m.Id == brouillonId)).StatutFiche.Should().BeNull();
    }
}

public class DecisionsServiceTests
{
    [Fact]
    public async Task SaveAsync_Refuse_SansTransfertSecretariat()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var mission = await db.Missions.Include(m => m.Ecole)
            .FirstAsync(m => m.StatutFiche == FicheStatuts.Validee
                             || m.Validite == MissionStatuts.EnCours
                             || m.Validite == MissionStatuts.Signe);
        mission.StatutFiche = FicheStatuts.Validee;
        mission.ValideeLe = DateTime.UtcNow;
        mission.RapportEquipeDeposeLe = null;
        mission.RapportSecretariatDeposeLe = null;
        // Retirer une éventuelle décision seed sur ce n° ordre
        var existingDec = await db.Decisions.Where(d => d.NumOrdre == mission.NumOrdre).ToListAsync();
        db.Decisions.RemoveRange(existingDec);
        await db.SaveChangesAsync();

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = mission.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("transféré");
    }

    [Fact]
    public async Task SaveAsync_Ok_ApresTransfertSecretariat()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");

        result.Success.Should().BeTrue(result.Message);
    }

    [Fact]
    public async Task FichesSansDecisionAsync_ExclutSansTransfert()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var mission = await db.Missions.FirstAsync(m => m.StatutFiche == FicheStatuts.Validee
            || m.Validite == MissionStatuts.EnCours);
        mission.StatutFiche = FicheStatuts.Validee;
        mission.RapportEquipeDeposeLe = null;
        mission.RapportSecretariatDeposeLe = null;
        db.Decisions.RemoveRange(await db.Decisions.Where(d => d.NumOrdre == mission.NumOrdre).ToListAsync());
        await db.SaveChangesAsync();

        var list = await sut.FichesSansDecisionAsync();
        list.Should().NotContain(f => f.Id == mission.Id);

        TestDbExtensions.MarkRapportTransfereAuDp(mission);
        await db.SaveChangesAsync();
        list = await sut.FichesSansDecisionAsync();
        list.Should().Contain(f => f.Id == mission.Id);
    }

    [Fact]
    public async Task SaveAsync_CreatesDecision_OnFicheValidee()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");

        result.Success.Should().BeTrue(result.Message);
        var created = await db.Decisions.SingleAsync(d => d.NumOrdre == fiche.Numero);
        created.NumAgrement.Should().NotBeNullOrWhiteSpace();
        created.DecisionFin.Should().Be(DecisionTypes.SuspensionTemporaireChef);
    }

    [Fact]
    public void DecisionTypes_EcoleBienEntretenue_IsValidAndLabeled()
    {
        DecisionTypes.IsValid(DecisionTypes.EcoleBienEntretenue).Should().BeTrue();
        DecisionTypes.LabelOf(DecisionTypes.EcoleBienEntretenue)
            .Should().Be("École bien entretenue — Félicitations");
        DecisionTypes.All.Should().Contain(DecisionTypes.EcoleBienEntretenue);
    }

    [Fact]
    public async Task SaveAsync_CreatesDecision_EcoleBienEntretenue()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            TypeDecision = DecisionTypes.EcoleBienEntretenue
        }, "usr-002");

        result.Success.Should().BeTrue(result.Message);
        var created = await db.Decisions.SingleAsync(d => d.NumOrdre == fiche.Numero);
        created.DecisionFin.Should().Be(DecisionTypes.EcoleBienEntretenue);
        DecisionTypes.LabelOf(created.DecisionFin)
            .Should().Be("École bien entretenue — Félicitations");
    }

    [Fact]
    public async Task SaveAsync_OnBrouillonFiche_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var brouillon = await db.FichesQuery().AsNoTracking()
            .FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
        var ecoleId = await db.EcoleIdForMissionAsync(brouillon);

        var result = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = brouillon.Id,
            EcoleId = ecoleId,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("validée");
    }

    [Fact]
    public async Task SaveAsync_SecondDecisionSameFiche_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);
        var dto = new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            EcoleId = fiche.EcoleId,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        };

        (await sut.SaveAsync(dto, "usr-002")).Success.Should().BeTrue();
        var second = await sut.SaveAsync(dto, "usr-002");

        second.Success.Should().BeFalse();
        (await db.Decisions.CountAsync(d => d.NumOrdre == fiche.Numero)).Should().Be(1);
    }

    [Fact]
    public async Task SaveAsync_OtherFiche_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var f1 = await TestDb.EnsureFicheSansDecisionAsync(db);
        (await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = f1.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002")).Success.Should().BeTrue();

        var f2 = await TestDb.EnsureFicheSansDecisionAsync(db);
        f2.Id.Should().NotBe(f1.Id);

        var other = await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = f2.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");

        other.Success.Should().BeTrue(other.Message);
        (await db.Decisions.CountAsync(d => d.NumOrdre == f2.Numero)).Should().Be(1);
    }

    [Fact]
    public async Task DeleteAsync_RestoresFicheSansDecision()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        var fiche = await TestDb.EnsureFicheSansDecisionAsync(db);
        await sut.SaveAsync(new SaveDecisionDto
        {
            FicheControleId = fiche.Id,
            TypeDecision = DecisionTypes.SuspensionTemporaireChef
        }, "usr-002");
        var decId = await db.Decisions.Where(d => d.NumOrdre == fiche.Numero).Select(d => d.NumDecision).FirstAsync();

        var del = await sut.DeleteAsync(decId);

        del.Success.Should().BeTrue();
        (await sut.QueryFichesSansDecisionAsync()).Should().Contain(f => f.Id == fiche.Id);
    }

    [Fact]
    public async Task FichesSansDecisionAsync_OnlyValideesWithoutDecision()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DecisionsService(db, users);
        await TestDb.EnsureFicheSansDecisionAsync(db);

        var list = await sut.FichesSansDecisionAsync();

        list.Should().NotBeEmpty();
        list.Should().OnlyContain(f => f.Statut == FicheStatuts.Validee);
        foreach (var f in list)
            (await db.Decisions.AnyAsync(d => d.NumOrdre == f.Numero)).Should().BeFalse();
    }
}

public class DashboardServiceTests
{
    [Fact]
    public async Task GetDashboardAsync_SeededStore_ReturnsKpis()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DashboardService(db, users);

        var dto = await sut.GetDashboardAsync("Administrateur système", "usr-001");

        dto.EcolesCount.Should().BeGreaterThan(0);
        dto.EcolesByRegime.Should().NotBeEmpty();
        dto.RoleTip.Should().NotBeNullOrWhiteSpace();
        dto.GetType().GetProperty("RapportsDeposes").Should().BeNull();
    }
}

public class AgentsServiceTests
{
    [Fact]
    public async Task ListAsync_FilterActif_ReturnsOnlyMatching()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        await sut.SaveAsync(new SaveAgentDto
        {
            Matricule = "AGT-INACTIF",
            NomComplet = "Agent Inactif UT",
            Actif = false
        });

        var actifs = await sut.ListAsync(new AgentFilterDto { Actif = true });
        var inactifs = await sut.ListAsync(new AgentFilterDto { Actif = false });
        var byNom = await sut.ListAsync(new AgentFilterDto { Q = "Inactif UT" });

        actifs.Should().NotBeEmpty();
        actifs.Should().OnlyContain(a => a.Actif);
        actifs.Should().NotContain(a => a.Id == "AGT-INACTIF");

        inactifs.Should().ContainSingle(a => a.Id == "AGT-INACTIF");
        inactifs.Should().OnlyContain(a => !a.Actif);

        byNom.Should().ContainSingle(a => a.Id == "AGT-INACTIF");
    }

    [Fact]
    public async Task SaveAsync_Create_WithMatricule_Succeeds()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        var result = await sut.SaveAsync(new SaveAgentDto
        {
            Id = null,
            Matricule = "MAT001",
            NomComplet = "Agent Test MAT001",
            Telephone = "+243899999999",
            Actif = true
        });

        result.Success.Should().BeTrue(result.Message);
        result.Message.Should().Be("Agent enregistré.");
        var agent = await db.Agents.SingleAsync(a => a.MatrAgent == "MAT001");
        agent.NomAgent.Should().Be("Agent Test MAT001");
        agent.TelAgent.Should().Be("+243899999999");
    }

    [Fact]
    public async Task SaveAsync_Create_DuplicateMatricule_FailsInFrench()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        var first = await sut.SaveAsync(new SaveAgentDto
        {
            Matricule = "MAT001",
            NomComplet = "Premier agent"
        });
        first.Success.Should().BeTrue(first.Message);

        var duplicate = await sut.SaveAsync(new SaveAgentDto
        {
            Id = null,
            Matricule = "MAT001",
            NomComplet = "Deuxième agent"
        });

        duplicate.Success.Should().BeFalse();
        duplicate.Message.Should().Be("Ce matricule est déjà utilisé.");
        (await db.Agents.CountAsync(a => a.MatrAgent == "MAT001")).Should().Be(1);
        (await db.Agents.SingleAsync(a => a.MatrAgent == "MAT001")).NomAgent.Should().Be("Premier agent");
    }

    [Fact]
    public async Task SaveAsync_Create_WithoutMatricule_FailsInFrench()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        var result = await sut.SaveAsync(new SaveAgentDto
        {
            Matricule = "   ",
            NomComplet = "Sans matricule"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Matricule obligatoire.");
    }

    [Fact]
    public async Task SaveAsync_Create_WithoutNom_FailsInFrench()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        var result = await sut.SaveAsync(new SaveAgentDto
        {
            Matricule = "MAT002",
            NomComplet = ""
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Be("Nom obligatoire.");
    }

    [Fact]
    public async Task SaveAsync_Update_DoesNotOverwriteViaCreatePath()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);

        await sut.SaveAsync(new SaveAgentDto { Matricule = "MAT001", NomComplet = "Original" });

        var update = await sut.SaveAsync(new SaveAgentDto
        {
            Id = "MAT001",
            Matricule = "MAT001",
            NomComplet = "Modifié",
            Telephone = "+243811111111"
        });

        update.Success.Should().BeTrue(update.Message);
        var agent = await db.Agents.SingleAsync(a => a.MatrAgent == "MAT001");
        agent.NomAgent.Should().Be("Modifié");
        agent.TelAgent.Should().Be("+243811111111");
    }

    [Fact]
    public async Task DeleteAsync_WhenLinkedToMission_Fails()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new AgentsService(db, users);
        var linked = await db.Affectations.Select(p => p.MatrAgent).FirstAsync();

        var result = await sut.DeleteAsync(linked);

        result.Success.Should().BeFalse();
        result.Blocked.Should().BeTrue();
        result.Title.Should().Be("Suppression non autorisée");
        result.Message.Should().Contain("ne peut pas être retiré");
        result.Detail.Should().Contain("missions");
    }
}

public class UtilisateursServiceTests
{
    [Fact]
    public async Task ListAsync_DoesNotExposePassword()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var list = await sut.ListAsync();

        list.Should().NotBeEmpty();
        list.First().GetType().GetProperty("MotDePasse").Should().BeNull();
        typeof(UtilisateurListDto).GetProperty("MotDePasse").Should().BeNull();
    }

    [Fact]
    public async Task Seed_EnsuresAdmin_ByEmail()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var admin = await host.Users.FindByEmailAsync(IdentitySeeder.AdminEmail);
        admin.Should().NotBeNull();
        admin!.Role.Should().Be("Administrateur système");
        admin.UserName.Should().Be(IdentitySeeder.AdminEmail);
        (await host.Users.CheckPasswordAsync(admin, IdentitySeeder.AdminPassword)).Should().BeTrue();
    }

    [Fact]
    public async Task Seed_DoesNotPurgeCreatedUsers()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var create = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Secrétaire Persistant",
            Contact = "sec.persist@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123",
            Statut = "actif"
        });
        create.Success.Should().BeTrue();

        var before = await host.Users.FindByEmailAsync("sec.persist@inspect-san.cd");
        before.Should().NotBeNull();
        var createdId = before!.Id;

        await IdentitySeeder.SeedAsync(host.Users, host.Roles);

        var after = await host.Users.FindByEmailAsync("sec.persist@inspect-san.cd");
        after.Should().NotBeNull();
        after!.Id.Should().Be(createdId);
        after.Nom.Should().Be("Secrétaire Persistant");

        var admin = await host.Users.FindByEmailAsync(IdentitySeeder.AdminEmail);
        admin.Should().NotBeNull();
    }

    [Fact]
    public async Task Save_RejectsMismatchedPasswords()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Test User",
            Contact = "test.user@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Autre@123",
            Statut = "actif"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("ne correspondent pas");
    }

    [Fact]
    public async Task Save_CreatesUserWithEmailAsUserName()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Secrétaire Test",
            Contact = "sec.test@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123",
            Statut = "actif"
        });

        result.Success.Should().BeTrue();
        var created = await host.Users.FindByEmailAsync("sec.test@inspect-san.cd");
        created.Should().NotBeNull();
        created!.UserName.Should().Be("sec.test@inspect-san.cd");
    }

    [Fact]
    public async Task Save_RejectsRoleChefEtablissement()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Chef Legacy",
            Contact = "chef.legacy@inspect-san.cd",
            Role = "Chef d'établissement",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123",
            Statut = "actif",
            EcoleId = "eco-001"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("n'est plus un compte");
        (await host.Users.FindByEmailAsync("chef.legacy@inspect-san.cd")).Should().BeNull();
    }

    [Fact]
    public async Task SaveAsync_WithId_IsRejected()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);
        var admin = await host.Users.FindByEmailAsync(IdentitySeeder.AdminEmail);

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Id = admin!.Id,
            Nom = "Hack Admin",
            Contact = IdentitySeeder.AdminEmail,
            Role = "Administrateur système",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("Modification admin interdite");
        (await host.Users.FindByIdAsync(admin.Id))!.Nom.Should().NotBe("Hack Admin");
    }

    [Fact]
    public async Task SetStatut_DeactivateAndReactivate()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        (await sut.CreateAsync(new SaveUtilisateurDto
        {
            Nom = "Agent Toggle",
            Contact = "agent.toggle@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123",
            Statut = "actif"
        })).Success.Should().BeTrue();

        var user = await host.Users.FindByEmailAsync("agent.toggle@inspect-san.cd");
        user.Should().NotBeNull();

        var off = await sut.SetStatutAsync(user!.Id, "inactif");
        off.Success.Should().BeTrue();
        (await host.Users.FindByIdAsync(user.Id))!.Statut.Should().Be("inactif");

        var on = await sut.SetStatutAsync(user.Id, "actif");
        on.Success.Should().BeTrue();
        (await host.Users.FindByIdAsync(user.Id))!.Statut.Should().Be("actif");
    }

    [Fact]
    public async Task UpdateProfil_OwnUser_UpdatesCoords()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        (await sut.CreateAsync(new SaveUtilisateurDto
        {
            Nom = "Profil User",
            Contact = "profil.user@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        })).Success.Should().BeTrue();

        var user = await host.Users.FindByEmailAsync("profil.user@inspect-san.cd");
        var result = await sut.UpdateProfilAsync(user!.Id, new UpdateProfilDto
        {
            Nom = "Profil Modifié",
            Contact = "profil.modifie@inspect-san.cd",
            Telephone = "+243800000001"
        });

        result.Success.Should().BeTrue();
        var updated = await host.Users.FindByIdAsync(user.Id);
        updated!.Nom.Should().Be("Profil Modifié");
        updated.Email.Should().Be("profil.modifie@inspect-san.cd");
        updated.UserName.Should().Be("profil.modifie@inspect-san.cd");
        updated.Telephone.Should().Be("+243800000001");
        updated.Role.Should().Be("Agent du Secrétariat");
    }

    [Fact]
    public async Task UpdateProfil_CannotAffectOtherUser_ByUsingOwnIdOnly()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);
        var admin = await host.Users.FindByEmailAsync(IdentitySeeder.AdminEmail);

        (await sut.CreateAsync(new SaveUtilisateurDto
        {
            Nom = "Autre User",
            Contact = "autre.user@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        })).Success.Should().BeTrue();

        var other = await host.Users.FindByEmailAsync("autre.user@inspect-san.cd");

        var result = await sut.UpdateProfilAsync(admin!.Id, new UpdateProfilDto
        {
            Nom = "Admin Renommé",
            Contact = IdentitySeeder.AdminEmail
        });
        result.Success.Should().BeTrue();

        (await host.Users.FindByIdAsync(other!.Id))!.Nom.Should().Be("Autre User");
        (await host.Users.FindByIdAsync(admin.Id))!.Nom.Should().Be("Admin Renommé");
    }

    [Fact]
    public async Task UpdateProfil_ChangePassword_RequiresCurrent()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        (await sut.CreateAsync(new SaveUtilisateurDto
        {
            Nom = "Pwd User",
            Contact = "pwd.user@inspect-san.cd",
            Role = "Agent du Secrétariat",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        })).Success.Should().BeTrue();

        var user = await host.Users.FindByEmailAsync("pwd.user@inspect-san.cd");

        var fail = await sut.UpdateProfilAsync(user!.Id, new UpdateProfilDto
        {
            Nom = user.Nom,
            Contact = user.Email!,
            NouveauMotDePasse = "Nouveau@123",
            ConfirmationMotDePasse = "Nouveau@123"
        });
        fail.Success.Should().BeFalse();

        var ok = await sut.UpdateProfilAsync(user.Id, new UpdateProfilDto
        {
            Nom = user.Nom,
            Contact = user.Email!,
            MotDePasseActuel = "Secret@123",
            NouveauMotDePasse = "Nouveau@123",
            ConfirmationMotDePasse = "Nouveau@123"
        });
        ok.Success.Should().BeTrue();
        (await host.Users.CheckPasswordAsync(await host.Users.FindByIdAsync(user.Id)!, "Nouveau@123")).Should().BeTrue();
    }

    [Fact]
    public async Task SaveUtilisateur_Controleur_WithAgentId_Succeeds()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        await DbSeeder.SeedAsync(host.Db);
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);
        var agent = await host.Db.Agents.AsNoTracking().FirstAsync();

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Compte Agent",
            Contact = "compte.agent@inspect-san.cd",
            Role = "Contrôleur",
            AgentId = agent.Id,
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        });

        result.Success.Should().BeTrue(result.Message);
        var user = await host.Users.FindByEmailAsync("compte.agent@inspect-san.cd");
        user.Should().NotBeNull();
        user!.AgentId.Should().Be(agent.Id);
    }

    [Fact]
    public async Task SaveUtilisateur_Controleur_WithoutAgentId_Fails()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);

        var result = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Sans Agent",
            Contact = "sans.agent@inspect-san.cd",
            Role = "Contrôleur",
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        });

        result.Success.Should().BeFalse();
        result.Message.Should().Contain("agent");
    }

    [Fact]
    public async Task SaveUtilisateur_SecondCompteMemeAgent_Fails()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        await DbSeeder.SeedAsync(host.Db);
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);
        var agentId = await host.Db.Agents.Select(a => a.MatrAgent).FirstAsync();

        var first = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Premier",
            Contact = "premier.agent@inspect-san.cd",
            Role = "Contrôleur",
            AgentId = agentId,
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        });
        first.Success.Should().BeTrue();

        var second = await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = "Second",
            Contact = "second.agent@inspect-san.cd",
            Role = "Contrôleur",
            AgentId = agentId,
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        });

        second.Success.Should().BeFalse();
        second.Message.Should().Contain("déjà un compte");
    }

    [Fact]
    public async Task ListAgentsSansCompte_ExcludesLinkedAgents()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        await DbSeeder.SeedAsync(host.Db);
        var sut = new UtilisateursService(host.Users, host.Roles, host.Db, host.Store);
        var agent = await host.Db.Agents.AsNoTracking().FirstAsync();

        (await sut.SaveAsync(new SaveUtilisateurDto
        {
            Nom = agent.NomComplet,
            Contact = "linked.agent@inspect-san.cd",
            Role = "Contrôleur",
            AgentId = agent.Id,
            MotDePasse = "Secret@123",
            ConfirmationMotDePasse = "Secret@123"
        })).Success.Should().BeTrue();

        var sansCompte = await sut.ListAgentsSansCompteAsync();
        sansCompte.Should().NotContain(a => a.AgentId == agent.Id);
    }
}

public class CarnetCoverageTests
{
    [Fact]
    public async Task Seed_HasMissionAffectationsFichesDecisions()
    {
        var (db, _) = await TestDb.CreateSeededAsync();

        (await db.Missions.CountAsync()).Should().BeGreaterThan(0);
        (await db.Affectations.CountAsync()).Should().BeGreaterThan(0);
        (await db.FichesQuery().CountAsync()).Should().BeGreaterThan(0);
        (await db.Decisions.CountAsync()).Should().BeGreaterThan(0);
        (await db.Categories.CountAsync()).Should().BeGreaterThan(0);
        (await db.Produits.CountAsync()).Should().BeGreaterThan(0);
        (await db.Missions.CountAsync(m => m.CodeProduit != null)).Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task Fiche_LinksToMission_WithProduitPrincipal()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.FichesQuery()
            .FirstAsync(m => m.CodeProduit != null);

        mission.NumOrdre.Should().NotBeNullOrWhiteSpace();
        mission.CodeProduit.Should().NotBeNull();
        mission.CodeProduit!.Value.Should().BeGreaterThan(0);
        mission.GetType().GetProperty("OrdreMissionId").Should().BeNull();
    }

    [Fact]
    public async Task Decision_LinksToMission()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var decision = await db.Decisions.AsNoTracking().FirstAsync();
        decision.NumOrdre.Should().NotBeNullOrWhiteSpace();
        (await db.Missions.AnyAsync(m => m.NumOrdre == decision.NumOrdre)).Should().BeTrue();
        decision.GetType().GetProperty("RapportId").Should().BeNull();
    }

    [Fact]
    public async Task Ecole_HasSousDivisionAndAdresse_NoDocuments()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var ecole = await db.Ecoles.AsNoTracking()
            .Include(e => e.Categorie)
            .FirstAsync(e => e.Id == "eco-001");

        ecole.SousDivision.Should().NotBeNullOrWhiteSpace();
        ecole.Categorie.Should().NotBeNull();
        ecole.Adresse.Should().NotBeNullOrWhiteSpace();
        ecole.GetType().GetProperty("Documents").Should().BeNull();
        ecole.GetType().GetProperty("CommuneId").Should().BeNull();
    }

    [Fact]
    public async Task Mission_HasAffectationsWithRoles()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions
            .Include(m => m.Affectations)
            .FirstAsync(m => m.Id == "mis-001");

        mission.Affectations.Should().HaveCountGreaterThanOrEqualTo(2);
        mission.Affectations.Should().Contain(p => p.Fonction == RolesMissionCodes.ChefEquipe);
        mission.GetType().GetProperty("EquipeId").Should().BeNull();
    }

    [Fact]
    public void DomainAssembly_DoesNotExposeRemovedTypes()
    {
        var entityAsm = typeof(FicheControle).Assembly;
        entityAsm.GetType("inspect_san.Models.Entities.Rapport").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.OrdreMission").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.Equipe").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.Controleur").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.DocumentMeta").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.RapportFiche").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.TypeDecision").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.RoleMission").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.Regime").Should().BeNull();
        entityAsm.GetType("inspect_san.Models.Entities.Sousproved").Should().BeNull();
    }
}
