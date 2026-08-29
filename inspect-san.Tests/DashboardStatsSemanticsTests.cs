using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Services;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Tests;

public class EtatBatimentTests
{
    [Theory]
    [InlineData("Bon", "Bon")]
    [InlineData("Satisfaisant", "Bon")]
    [InlineData("Moyen", "Moyen")]
    [InlineData("Mauvais", "Dégradé")]
    [InlineData("Dégradé", "Dégradé")]
    [InlineData("Critique", "Critique")]
    public void ToStatBucket_MapsAllKnownValues(string input, string expected)
        => EtatBatiment.ToStatBucket(input).Should().Be(expected);

    [Fact]
    public void FormOptions_HaveNoOrphans()
    {
        foreach (var opt in EtatBatiment.FormOptions)
            EtatBatiment.ToStatBucket(opt).Should().NotBeNull($"l'option formulaire « {opt} » doit être mappée");
    }
}

public class StatistiquesConformiteTests
{
    [Fact]
    public async Task Conformite_IncludesMauvais_AndSatisfaisantInBon()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var fiches = await db.FichesQuery().Take(4).ToListAsync();
        fiches.Should().HaveCountGreaterThanOrEqualTo(4);
        fiches[0].EtatBatiment = EtatBatiment.Bon;
        fiches[1].EtatBatiment = EtatBatiment.Satisfaisant;
        fiches[2].EtatBatiment = EtatBatiment.Mauvais;
        fiches[3].EtatBatiment = EtatBatiment.Critique;
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetAsync(new StatistiquesFilterDto());

        var byLabel = dto.Conformite.ToDictionary(c => c.Label, c => c.Value);
        byLabel.Should().ContainKey(EtatBatiment.BucketBon);
        byLabel.Should().ContainKey(EtatBatiment.BucketDegrade);
        byLabel.Should().ContainKey(EtatBatiment.BucketCritique);
        byLabel[EtatBatiment.BucketBon].Should().BeGreaterThanOrEqualTo(2);
        byLabel[EtatBatiment.BucketDegrade].Should().BeGreaterThanOrEqualTo(1);
        byLabel.Keys.Should().NotContain(EtatBatiment.Mauvais);
    }

    [Fact]
    public async Task TauxConformite_ExactFormula_BonMoyenOverRecognized()
    {
        var options = new DbContextOptionsBuilder<InspectSanDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        await using var db = new InspectSanDbContext(options);
        await DbSeeder.SeedAsync(db);

        var ecole = await db.Ecoles.AsNoTracking().FirstAsync();
        var mission = await db.Missions.FirstAsync(m => m.NumAgrement == ecole.NumAgrement);

        db.Photos.RemoveRange(await db.Photos.ToListAsync());
        db.Decisions.RemoveRange(await db.Decisions.ToListAsync());
        foreach (var m in await db.Missions.ToListAsync())
            m.StatutFiche = null;
        await db.SaveChangesAsync();

        void SetFicheEtat(string id, string etat)
        {
            var m = db.Missions.First(x => x.Id == id);
            m.StatutFiche = FicheStatuts.Validee;
            m.EtatBatiment = etat;
            m.NbreBatiment = 1;
            m.NbrEleve = 50;
            m.CreatedAt = DateTime.UtcNow;
        }

        SetFicheEtat(mission.Id, EtatBatiment.Bon);
        var m2 = new Mission
        {
            Id = "mis-t2", NumOrdre = "OM-T-002", NumAgrement = ecole.NumAgrement,
            Validite = MissionStatuts.EnCours, NomEquipe = "Equipe-T2", CreatedAt = DateTime.UtcNow
        };
        var m3 = new Mission
        {
            Id = "mis-t3", NumOrdre = "OM-T-003", NumAgrement = ecole.NumAgrement,
            Validite = MissionStatuts.EnCours, NomEquipe = "Equipe-T3", CreatedAt = DateTime.UtcNow
        };
        var m4 = new Mission
        {
            Id = "mis-t4", NumOrdre = "OM-T-004", NumAgrement = ecole.NumAgrement,
            Validite = MissionStatuts.EnCours, NomEquipe = "Equipe-T4", CreatedAt = DateTime.UtcNow
        };
        db.Missions.AddRange(m2, m3, m4);
        await db.SaveChangesAsync();
        SetFicheEtat("mis-t2", EtatBatiment.Moyen);
        SetFicheEtat("mis-t3", EtatBatiment.Mauvais);
        SetFicheEtat("mis-t4", EtatBatiment.Critique);
        await db.SaveChangesAsync();

        var sut = new StatistiquesService(db);
        var dto = await sut.GetAsync(new StatistiquesFilterDto());

        dto.FichesCount.Should().Be(4);
        dto.TauxConformite.Should().Be(50);
        dto.Conformite.Single(c => c.Label == EtatBatiment.BucketBon).Value.Should().Be(1);
        dto.Conformite.Single(c => c.Label == EtatBatiment.BucketMoyen).Value.Should().Be(1);
        dto.Conformite.Single(c => c.Label == EtatBatiment.BucketDegrade).Value.Should().Be(1);
        dto.Conformite.Single(c => c.Label == EtatBatiment.BucketCritique).Value.Should().Be(1);
    }
}

public class DashboardKpiSemanticsTests
{
    [Fact]
    public async Task MissionsEnCours_OnlyEnCours_NotSigne()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DashboardService(db, users);

        var enCours = await db.Missions.CountAsync(m => m.Validite == MissionStatuts.EnCours);
        var signes = await db.Missions.CountAsync(m => m.Validite == MissionStatuts.Signe);
        signes.Should().BeGreaterThan(0, "le seed doit avoir des missions signées pour valider l'exclusion");

        var dto = await sut.GetDashboardAsync("Administrateur système", "usr-001");
        dto.MissionsEnCours.Should().Be(enCours);
        dto.MissionsEnCours.Should().NotBe(enCours + signes);
    }

    [Fact]
    public async Task FichesEnAttente_OnlyEnAttenteValidation()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new DashboardService(db, users);

        var expected = await db.FichesQuery().CountAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);
        var brouillons = await db.FichesQuery().CountAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
        brouillons.Should().BeGreaterThan(0);

        var dto = await sut.GetDashboardAsync("Administrateur système", "usr-001");
        dto.FichesEnAttente.Should().Be(expected);
    }

    [Fact]
    public async Task LegacyChefRole_Dashboard_EmptyScope()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        users.AddJournal("Authentification", "connexion", "secret admin", "usr-001");
        users.AddJournal("Fiches", "soumission", "fiche eco-001", "usr-003");

        var sut = new DashboardService(db, users);
        var dto = await sut.GetDashboardAsync("Chef d'établissement", "usr-006", "eco-001");

        dto.EcolesCount.Should().Be(0);
        dto.RecentJournal.Should().BeEmpty();
    }
}
