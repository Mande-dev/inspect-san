using System.Net.Mail;
using FluentAssertions;
using inspect_san.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace inspect_san.Tests;

public class AppEmailSenderTests
{
    [Fact]
    public async Task TrySendAsync_EmptyTo_Fails()
    {
        var sut = CreateSender(ConfiguredOptions());
        var (ok, detail) = await sut.TrySendAsync("  ", "s", "<p>x</p>");
        ok.Should().BeFalse();
        detail.Should().Contain("vide");
    }

    [Fact]
    public async Task TrySendAsync_InvalidTo_Fails()
    {
        var sut = CreateSender(ConfiguredOptions());
        var (ok, detail) = await sut.TrySendAsync("pas-une-adresse", "s", "<p>x</p>");
        ok.Should().BeFalse();
        detail.Should().Contain("invalide");
    }

    [Fact]
    public async Task TrySendAsync_NotConfigured_Fails()
    {
        var sut = CreateSender(new EmailOptions());
        var (ok, detail) = await sut.TrySendAsync("chef@example.com", "s", "<p>x</p>");
        ok.Should().BeFalse();
        detail.Should().Contain("non configuré");
    }

    [Fact]
    public void ResolveFromAddress_Gmail_ForcesSmtpUser_EvenIfFromDiffers()
    {
        var from = AppEmailSender.ResolveFromAddress(new EmailOptions
        {
            SmtpHost = "smtp.gmail.com",
            SmtpUser = "compte@gmail.com",
            From = "autre@domaine.com"
        });
        from.Should().Be("compte@gmail.com");
    }

    [Fact]
    public void ResolveFromAddress_NonGmail_KeepsFrom()
    {
        var from = AppEmailSender.ResolveFromAddress(new EmailOptions
        {
            SmtpHost = "pro.turbo-smtp.com",
            SmtpUser = "key",
            From = "noreply@exemple.com"
        });
        from.Should().Be("noreply@exemple.com");
    }

    [Fact]
    public void FormatSmtpError_IncludesInnerExceptions()
    {
        var ex = new SmtpException("outer", new InvalidOperationException("inner-detail"));
        var msg = AppEmailSender.FormatSmtpError(ex);
        msg.Should().Contain("outer");
        msg.Should().Contain("inner-detail");
        msg.Should().Contain("status=");
    }

    /// <summary>
    /// Envoi réel : vers le compte SMTP (soi) puis vers une autre boîte (INSPECTSAN_TEST_TO).
    /// Nécessite User Secrets / appsettings.Email.local.json.
    /// </summary>
    [Fact]
    public async Task LiveSmtp_SendToSelf_AndOptionalExternalRecipient()
    {
        var options = LoadLiveEmailOptions();
        if (options == null
            || string.IsNullOrWhiteSpace(options.SmtpHost)
            || string.IsNullOrWhiteSpace(options.SmtpUser)
            || string.IsNullOrWhiteSpace(options.SmtpPassword))
        {
            // Pas de SMTP local → skip silencieux (CI / machine sans secrets).
            return;
        }

        var sut = CreateSender(options);
        sut.IsConfigured.Should().BeTrue();

        var self = options.SmtpUser!.Trim();
        var (okSelf, detailSelf) = await sut.TrySendAsync(
            self,
            "Inspect-San test SMTP (soi)",
            "<p>Test destinataire = compte SMTP.</p>");
        okSelf.Should().BeTrue(detailSelf);

        // Destinataire différent du compte SMTP (cas métier Chef.Email).
        var external = Environment.GetEnvironmentVariable("INSPECTSAN_TEST_TO")?.Trim();
        if (string.IsNullOrWhiteSpace(external))
        {
            // Alias Gmail +tag = autre adresse visible, même boîte (valide le chemin « autre To »).
            var at = self.IndexOf('@');
            external = at > 0
                ? self[..at] + "+chef-test" + self[at..]
                : null;
        }

        if (string.IsNullOrWhiteSpace(external)
            || string.Equals(external, self, StringComparison.OrdinalIgnoreCase))
            return;

        var pdf = System.Text.Encoding.ASCII.GetBytes("%PDF-1.4 test");
        var (okExt, detailExt) = await sut.TrySendAsync(
            external,
            "Inspect-San test SMTP (destinataire externe)",
            "<p>Test destinataire ≠ compte SMTP (simulation Chef.Email).</p>",
            [new EmailAttachment("OM-test.pdf", pdf)]);
        okExt.Should().BeTrue(
            "Envoi vers un autre destinataire que le compte SMTP doit réussir. Détail : " + detailExt);
    }

    private static AppEmailSender CreateSender(EmailOptions options)
        => new(Options.Create(options), NullLogger<AppEmailSender>.Instance);

    private static EmailOptions ConfiguredOptions() => new()
    {
        SmtpHost = "smtp.gmail.com",
        SmtpPort = 587,
        SmtpUser = "compte@gmail.com",
        SmtpPassword = "app-password",
        From = "compte@gmail.com",
        UseSsl = true
    };

    private static EmailOptions? LoadLiveEmailOptions()
    {
        var root = FindRepoRoot();
        if (root == null) return null;

        var config = new ConfigurationBuilder()
            .SetBasePath(root)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddJsonFile("appsettings.Email.local.json", optional: true)
            .AddUserSecrets(typeof(inspect_san.Services.AppEmailSender).Assembly, optional: true)
            .AddEnvironmentVariables()
            .Build();

        var section = config.GetSection(EmailOptions.SectionName);
        if (!section.Exists()) return null;
        var opts = new EmailOptions();
        section.Bind(opts);
        return opts;
    }

    private static string? FindRepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            if (File.Exists(Path.Combine(dir.FullName, "inspect-san.csproj")))
                return dir.FullName;
            dir = dir.Parent;
        }
        return null;
    }
}
