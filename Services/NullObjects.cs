namespace inspect_san.Services;

/// <summary>Fallbacks pour tests / construction manuelle des services.</summary>
public sealed class NullDomainEmailNotifier : IDomainEmailNotifier
{
    public static readonly NullDomainEmailNotifier Instance = new();
    public Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default)
        => Task.CompletedTask;
    public Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default)
        => Task.CompletedTask;
}

/// <summary>Collecte les e-mails pour les tests.</summary>
public sealed class RecordingEmailNotifier : IDomainEmailNotifier
{
    public List<(string Subject, string? UserId, string? Role, string? Email)> Sent { get; } = new();

    public Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default)
    {
        Sent.Add((subject, toUserId, toRole, null));
        return Task.CompletedTask;
    }

    public Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default)
    {
        Sent.Add((subject, null, null, email));
        return Task.CompletedTask;
    }
}

/// <summary>No-op SMTP pour construction manuelle des services.</summary>
public sealed class NullAppEmailSender : IAppEmailSender
{
    public static readonly NullAppEmailSender Instance = new();
    public bool IsConfigured => false;

    public Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => Task.CompletedTask;

    public Task SendAsync(
        string toEmail, string subject, string htmlBody, IReadOnlyList<EmailAttachment>? attachments, CancellationToken ct = default)
        => Task.CompletedTask;

    public Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => Task.FromResult((false, "SMTP non configure (NullAppEmailSender)."));

    public Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, IReadOnlyList<EmailAttachment>? attachments, CancellationToken ct = default)
        => Task.FromResult((false, "SMTP non configure (NullAppEmailSender)."));
}

/// <summary>Enregistre les envois SMTP (tests).</summary>
public sealed class RecordingAppEmailSender : IAppEmailSender
{
    public List<(string To, string Subject, string Body, IReadOnlyList<EmailAttachment> Attachments)> Sent { get; } = new();
    public bool IsConfigured => true;
    public bool FailNext { get; set; }

    public Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => SendAsync(toEmail, subject, htmlBody, null, ct);

    public async Task SendAsync(
        string toEmail, string subject, string htmlBody, IReadOnlyList<EmailAttachment>? attachments, CancellationToken ct = default)
        => await TrySendAsync(toEmail, subject, htmlBody, attachments, ct);

    public Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => TrySendAsync(toEmail, subject, htmlBody, null, ct);

    public Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, IReadOnlyList<EmailAttachment>? attachments, CancellationToken ct = default)
    {
        if (FailNext)
            return Task.FromResult((false, "Echec SMTP simule."));
        Sent.Add((toEmail, subject, htmlBody, attachments?.ToList() ?? new List<EmailAttachment>()));
        return Task.FromResult((true, $"OK -> {toEmail}"));
    }
}

/// <summary>PDF vide pour construction manuelle.</summary>
public sealed class NullOrdreMissionPdfService : Interface.IOrdreMissionPdfService
{
    public static readonly NullOrdreMissionPdfService Instance = new();
    public string BuildFileName(string numOrdre) => $"OM-{numOrdre}.pdf";
    public Task<byte[]> GenerateAsync(string missionId, CancellationToken ct = default)
        => Task.FromResult(Array.Empty<byte>());
}

/// <summary>PDF fixe pour les tests d'envoi OM.</summary>
public sealed class FakeOrdreMissionPdfService : Interface.IOrdreMissionPdfService
{
    public byte[] PdfBytes { get; set; } = System.Text.Encoding.ASCII.GetBytes("%PDF-1.4 fake");
    public string BuildFileName(string numOrdre) => $"OM-{numOrdre}.pdf";
    public Task<byte[]> GenerateAsync(string missionId, CancellationToken ct = default)
        => Task.FromResult(PdfBytes);
}

/// <summary>PDF lettre de décision vide.</summary>
public sealed class NullLettreDecisionPdfService : Interface.ILettreDecisionPdfService
{
    public static readonly NullLettreDecisionPdfService Instance = new();
    public string BuildFileName(string numDecision) => $"LD-{numDecision}.pdf";
    public Task<byte[]> GenerateAsync(string decisionId, CancellationToken ct = default)
        => Task.FromResult(Array.Empty<byte>());
}

/// <summary>PDF fixe pour les tests d'envoi LD.</summary>
public sealed class FakeLettreDecisionPdfService : Interface.ILettreDecisionPdfService
{
    public byte[] PdfBytes { get; set; } = System.Text.Encoding.ASCII.GetBytes("%PDF-1.4 fake-ld");
    public string BuildFileName(string numDecision)
    {
        var safe = (numDecision ?? "decision").Replace('/', '-');
        return $"LD-{safe}.pdf";
    }
    public Task<byte[]> GenerateAsync(string decisionId, CancellationToken ct = default)
        => Task.FromResult(PdfBytes);
}
