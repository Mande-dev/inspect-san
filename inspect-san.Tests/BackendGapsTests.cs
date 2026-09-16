using System.Text;
using FluentAssertions;
using inspect_san.Models.Constants;
using inspect_san.Models.DTOs;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;

namespace inspect_san.Tests;

public class ActivityStorePersistenceTests
{
    [Fact]
    public async Task JournalAndNotifications_SurviveNewStoreInstance()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        users.AddJournal("Test", "action", "détail persistant", "u1");
        users.AddNotification("Titre", "Message", "u1");

        var again = new MockUserStore(db);
        again.JournalActivite.Should().Contain(j => j.Detail == "détail persistant");
        again.NotificationsForUser("u1").Should().Contain(n => n.Titre == "Titre");

        again.MarkNotificationRead(again.NotificationsForUser("u1").First(n => n.Titre == "Titre").Id);
        var third = new MockUserStore(db);
        third.NotificationsForUser("u1").First(n => n.Titre == "Titre").Lu.Should().BeTrue();
    }
}

public class FileUploadServiceTests
{
    private static IFileStorageService CreateStorage(string root)
    {
        Directory.CreateDirectory(root);
        var env = new TestWebHostEnv(root);
        var opts = Options.Create(new FileStorageOptions
        {
            RootRelative = "uploads",
            MaxBytes = 1024 * 100,
            AllowedExtensions = [".pdf", ".png"]
        });
        return new FileStorageService(env, opts);
    }

    private static IFormFile FakeFile(string name, string contentType, byte[] bytes)
    {
        var stream = new MemoryStream(bytes);
        return new FormFile(stream, 0, bytes.Length, "file", name)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };
    }

    [Fact]
    public async Task UploadPhoto_OnBrouillon_PersistsFile()
    {
        var root = Path.Combine(Path.GetTempPath(), "isp-up-" + Guid.NewGuid().ToString("N"));
        try
        {
            var (db, users) = await TestDb.CreateSeededAsync();
            var fiche = await db.FichesQuery().FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
            var files = CreateStorage(root);
            var sut = new FichesControleService(db, users, files);
            var file = FakeFile("photo.png", "image/png", new byte[] { 1, 2, 3, 4 });

            var result = await sut.UploadPhotoAsync(fiche.Id, file, "Vue latrines");
            result.Success.Should().BeTrue(result.Message);

            var updated = await db.Missions.Include(m => m.Photos).FirstAsync(m => m.Id == fiche.Id);
            updated.Photos.Should().Contain(p => p.Nom == $"{fiche.Numero}-1" && !string.IsNullOrEmpty(p.Url));
            var abs = Path.Combine(root, updated.Photos.Last(p => p.Nom == $"{fiche.Numero}-1").Url.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
            File.Exists(abs).Should().BeTrue();
        }
        finally
        {
            if (Directory.Exists(root)) Directory.Delete(root, true);
        }
    }

    [Fact]
    public async Task UploadPhoto_RejectsNonBrouillon()
    {
        var root = Path.Combine(Path.GetTempPath(), "isp-up-" + Guid.NewGuid().ToString("N"));
        try
        {
            var (db, users) = await TestDb.CreateSeededAsync();
            var fiche = await db.FichesQuery().FirstAsync(m => m.StatutFiche != FicheStatuts.Brouillon);
            var files = CreateStorage(root);
            var sut = new FichesControleService(db, users, files);
            var file = FakeFile("photo.png", "image/png", new byte[] { 1, 2, 3, 4 });

            var result = await sut.UploadPhotoAsync(fiche.Id, file);
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("brouillon");
        }
        finally
        {
            if (Directory.Exists(root)) Directory.Delete(root, true);
        }
    }

    [Fact]
    public async Task UploadPhoto_RejectsBadExtension()
    {
        var root = Path.Combine(Path.GetTempPath(), "isp-up-" + Guid.NewGuid().ToString("N"));
        try
        {
            var (db, users) = await TestDb.CreateSeededAsync();
            var fiche = await db.FichesQuery().FirstAsync(m => m.StatutFiche == FicheStatuts.Brouillon);
            var files = CreateStorage(root);
            var sut = new FichesControleService(db, users, files);
            var file = FakeFile("virus.exe", "application/octet-stream", new byte[] { 0x4D, 0x5A });

            var result = await sut.UploadPhotoAsync(fiche.Id, file);
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Extension");
        }
        finally
        {
            if (Directory.Exists(root)) Directory.Delete(root, true);
        }
    }
}

file sealed class TestWebHostEnv : IWebHostEnvironment
{
    public TestWebHostEnv(string webRoot)
    {
        WebRootPath = webRoot;
        ContentRootPath = webRoot;
        EnvironmentName = "Development";
        ApplicationName = "tests";
        WebRootFileProvider = new PhysicalFileProvider(webRoot);
        ContentRootFileProvider = new PhysicalFileProvider(webRoot);
    }

    public string ApplicationName { get; set; }
    public IFileProvider WebRootFileProvider { get; set; }
    public string WebRootPath { get; set; }
    public string EnvironmentName { get; set; }
    public string ContentRootPath { get; set; }
    public IFileProvider ContentRootFileProvider { get; set; }
}

public class ForgotPasswordFlowTests
{
    [Fact]
    public async Task ResetPassword_ValidToken_ChangesPassword()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var user = host.Users.Users.First(u => u.Email != null);
        var token = await host.Users.GeneratePasswordResetTokenAsync(user);
        var result = await host.Users.ResetPasswordAsync(user, token, "Nouveau@123");
        result.Succeeded.Should().BeTrue();

        var check = await host.Users.CheckPasswordAsync(user, "Nouveau@123");
        check.Should().BeTrue();
    }

    [Fact]
    public async Task ResetPassword_InvalidToken_Fails()
    {
        await using var host = await TestDb.CreateIdentityHostAsync();
        var user = host.Users.Users.First(u => u.Email != null);
        var result = await host.Users.ResetPasswordAsync(user, "token-invalide", "Nouveau@123");
        result.Succeeded.Should().BeFalse();
    }
}

public class MissionTransitionTests
{
    [Fact]
    public async Task Mission_Transitions_LegalAndIllegal()
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
    public async Task FirstFiche_OnSigne_PassesMissionEnCours()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var mission = await db.Missions.FirstAsync(m => m.Validite == MissionStatuts.Signe);
        mission.StatutFiche = null;
        await db.SaveChangesAsync();
        var sut = new FichesControleService(db, users);
        var result = await sut.SaveAsync(new SaveFicheControleDto
        {
            MissionId = mission.Id,
            NombreBatiments = 1,
            EtatGeneral = "Satisfaisant",
            NombreEleves = 10,
            ToilettesFilles = 1,
            ToilettesGarcons = 1
        });
        result.Success.Should().BeTrue(result.Message);
        (await db.Missions.FirstAsync(m => m.Id == mission.Id)).Statut.Should().Be(MissionStatuts.EnCours);
    }
}

public class StatsExportAndEmailTests
{
    [Fact]
    public async Task ExportCsv_ContainsHeaders()
    {
        var (db, _) = await TestDb.CreateSeededAsync();
        var sut = new StatistiquesService(db);
        var csv = await sut.ExportCsvAsync(new StatistiquesFilterDto());
        csv.Should().StartWith("Indicateur,Valeur");
        csv.Should().Contain("Ecoles,");
        csv.Should().Contain("Fiches,");
    }

    [Fact]
    public async Task SignerMission_SendsEmailNotification()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var recorder = new RecordingEmailNotifier();
        var sut = new MissionsService(db, users, recorder);
        var mission = await db.Missions.FirstAsync(m => m.Validite == MissionStatuts.Brouillon
            || m.Validite == MissionStatuts.EnAttenteSignature);
        if (mission.Validite == MissionStatuts.Brouillon)
            await sut.DemanderSignatureAsync(mission.Id, "u");
        var result = await sut.SignerAsync(mission.Id, "u");
        result.Success.Should().BeTrue();
        recorder.Sent.Should().Contain(s =>
            s.Subject.Contains("signée", StringComparison.OrdinalIgnoreCase)
            && s.Role == DataScope.RoleControleur);
    }

    [Fact]
    public async Task ValiderFiche_KeepsInAppNotification_WithoutEmail()
    {
        var (db, users) = await TestDb.CreateSeededAsync();
        var sut = new FichesControleService(db, users);
        var enAttente = await db.FichesQuery().FirstAsync(m => m.StatutFiche == FicheStatuts.EnAttenteValidation);
        var notifBefore = users.Notifications.Count;

        var result = await sut.ValiderAsync(enAttente.Id, "usr-006");
        result.Success.Should().BeTrue();
        (await db.Missions.AsNoTracking().FirstAsync(m => m.Id == enAttente.Id))
            .StatutFiche.Should().Be(FicheStatuts.Validee);
        users.Notifications.Count.Should().BeGreaterThan(notifBefore);
        users.Notifications.Should().Contain(n =>
            n.Titre.Contains("validée", StringComparison.OrdinalIgnoreCase)
            || n.Message.Contains(enAttente.NumOrdre, StringComparison.Ordinal));
    }
}