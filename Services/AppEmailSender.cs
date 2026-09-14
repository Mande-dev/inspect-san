namespace inspect_san.Services;

/// <summary>Options SMTP pour l'envoi d'e-mails applicatifs.</summary>
public class EmailOptions
{
    public const string SectionName = "Email";
    public string? SmtpHost { get; set; }
    public int SmtpPort { get; set; } = 587;
    public string? SmtpUser { get; set; }
    public string? SmtpPassword { get; set; }
    public bool UseSsl { get; set; } = true;
    public string From { get; set; } = "noreply@inspect-san.local";
    public string? FromDisplayName { get; set; } = "Inspect-San";
}

/// <summary>Envoi d'e-mails applicatifs (SMTP ou journalisation).</summary>
public interface IAppEmailSender
{
    /// <summary>Envoie un e-mail HTML à une adresse donnée.</summary>
    Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);
    bool IsConfigured { get; }
}

/// <summary>Envoi SMTP si configuré ; sinon log + no-op (ne fait pas échouer le métier).</summary>
public class AppEmailSender : IAppEmailSender
{
    private readonly EmailOptions _options;
    private readonly ILogger<AppEmailSender> _logger;

    /// <summary>Initialise l'expéditeur avec les options SMTP et le journaliseur.</summary>
    public AppEmailSender(Microsoft.Extensions.Options.IOptions<EmailOptions> options, ILogger<AppEmailSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_options.SmtpHost);

    /// <summary>Envoie un e-mail HTML à une adresse donnée.</summary>
    public async Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(toEmail)) return;

        if (!IsConfigured)
        {
            _logger.LogInformation(
                "Email (SMTP non configuré) → {To} | {Subject} | {Body}",
                toEmail, subject, htmlBody);
            return;
        }

        try
        {
            using var client = new System.Net.Mail.SmtpClient(_options.SmtpHost, _options.SmtpPort)
            {
                EnableSsl = _options.UseSsl,
                DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network
            };
            if (!string.IsNullOrWhiteSpace(_options.SmtpUser))
                client.Credentials = new System.Net.NetworkCredential(_options.SmtpUser, _options.SmtpPassword);

            using var msg = new System.Net.Mail.MailMessage
            {
                From = new System.Net.Mail.MailAddress(_options.From, _options.FromDisplayName ?? "Inspect-San"),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            msg.To.Add(toEmail);
            await client.SendMailAsync(msg, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Échec envoi e-mail à {To} — flux métier non interrompu.", toEmail);
        }
    }
}
