using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace inspect_san.Services;

/// <summary>Pièce jointe e-mail.</summary>
public sealed record EmailAttachment(string FileName, byte[] Content, string ContentType = "application/pdf");

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
    /// <summary>Envoie un e-mail HTML à une adresse donnée (best-effort, n'échoue pas le métier).</summary>
    Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default);

    /// <summary>Envoie un e-mail HTML avec pièces jointes (best-effort).</summary>
    Task SendAsync(
        string toEmail,
        string subject,
        string htmlBody,
        IReadOnlyList<EmailAttachment>? attachments,
        CancellationToken ct = default);

    /// <summary>Comme <see cref="SendAsync(string,string,string,CancellationToken)"/> mais retourne le statut.</summary>
    Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, CancellationToken ct = default);

    /// <summary>Envoi avec pièces jointes + statut détaillé.</summary>
    Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail,
        string subject,
        string htmlBody,
        IReadOnlyList<EmailAttachment>? attachments,
        CancellationToken ct = default);

    bool IsConfigured { get; }
}

/// <summary>Envoi SMTP si configuré ; sinon log + no-op (ne fait pas échouer le métier).</summary>
public class AppEmailSender : IAppEmailSender
{
    private readonly EmailOptions _options;
    private readonly ILogger<AppEmailSender> _logger;

    /// <summary>Initialise l'expéditeur avec les options SMTP et le journaliseur.</summary>
    public AppEmailSender(IOptions<EmailOptions> options, ILogger<AppEmailSender> logger)
    {
        _options = options.Value;
        _logger = logger;
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_options.SmtpHost)
        && !string.IsNullOrWhiteSpace(_options.SmtpUser)
        && !string.IsNullOrWhiteSpace(_options.SmtpPassword);

    /// <inheritdoc />
    public Task SendAsync(string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => SendAsync(toEmail, subject, htmlBody, null, ct);

    /// <inheritdoc />
    public async Task SendAsync(
        string toEmail,
        string subject,
        string htmlBody,
        IReadOnlyList<EmailAttachment>? attachments,
        CancellationToken ct = default)
        => await TrySendAsync(toEmail, subject, htmlBody, attachments, ct);

    /// <inheritdoc />
    public Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail, string subject, string htmlBody, CancellationToken ct = default)
        => TrySendAsync(toEmail, subject, htmlBody, null, ct);

    /// <inheritdoc />
    public async Task<(bool Ok, string Detail)> TrySendAsync(
        string toEmail,
        string subject,
        string htmlBody,
        IReadOnlyList<EmailAttachment>? attachments,
        CancellationToken ct = default)
    {
        toEmail = (toEmail ?? "").Trim();
        if (string.IsNullOrWhiteSpace(toEmail))
            return (false, "Adresse destinataire vide.");

        if (!TryValidateEmail(toEmail, out var toError))
            return (false, toError);

        if (!IsConfigured)
        {
            _logger.LogInformation(
                "Email (SMTP non configuré) → {To} | {Subject} | PJ={Count}",
                toEmail, subject, attachments?.Count ?? 0);
            return (false,
                "SMTP non configuré : renseigner Email:SmtpHost, SmtpUser et SmtpPassword " +
                "(User Secrets ou appsettings.Email.local.json).");
        }

        var fromAddress = ResolveFromAddress(_options);
        if (!TryValidateEmail(fromAddress, out var fromError))
            return (false, "Expéditeur invalide : " + fromError);

        if (IsGmailHost(_options.SmtpHost)
            && !string.Equals(fromAddress, _options.SmtpUser!.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            // Gmail refuse / réécrit si From ≠ compte authentifié.
            _logger.LogWarning(
                "Gmail SMTP : From ({From}) forcé sur SmtpUser ({User}) pour éviter un refus d'envoi.",
                fromAddress, _options.SmtpUser);
            fromAddress = _options.SmtpUser!.Trim();
        }

        try
        {
            using var client = new SmtpClient(_options.SmtpHost!, _options.SmtpPort)
            {
                EnableSsl = _options.UseSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(_options.SmtpUser!.Trim(), _options.SmtpPassword)
            };

            using var msg = new MailMessage
            {
                From = new MailAddress(fromAddress, _options.FromDisplayName ?? "Inspect-San"),
                Subject = subject ?? "",
                Body = htmlBody ?? "",
                IsBodyHtml = true,
                // Aide certains serveurs (Gmail) à accepter l'enveloppe.
                Sender = new MailAddress(fromAddress, _options.FromDisplayName ?? "Inspect-San")
            };
            msg.To.Add(new MailAddress(toEmail));

            var streams = new List<MemoryStream>();
            try
            {
                if (attachments != null)
                {
                    foreach (var att in attachments)
                    {
                        if (att.Content == null || att.Content.Length == 0) continue;
                        var stream = new MemoryStream(att.Content);
                        streams.Add(stream);
                        msg.Attachments.Add(new Attachment(
                            stream,
                            string.IsNullOrWhiteSpace(att.FileName) ? "piece-jointe.pdf" : att.FileName,
                            string.IsNullOrWhiteSpace(att.ContentType) ? "application/pdf" : att.ContentType));
                    }
                }

                await client.SendMailAsync(msg, ct);
            }
            finally
            {
                foreach (var s in streams) s.Dispose();
            }

            var pj = attachments?.Count(a => a.Content is { Length: > 0 }) ?? 0;
            _logger.LogInformation(
                "SMTP OK host={Host} from={From} to={To} pj={Pj}",
                _options.SmtpHost, fromAddress, toEmail, pj);
            return (true,
                $"E-mail accepté par SMTP ({_options.SmtpHost}:{_options.SmtpPort}) → {toEmail}" +
                (pj > 0 ? $" ({pj} pièce(s) jointe(s))" : ""));
        }
        catch (Exception ex)
        {
            var detail = FormatSmtpError(ex);
            _logger.LogWarning(ex, "Échec envoi e-mail à {To} — {Detail}", toEmail, detail);
            return (false, detail);
        }
    }

    /// <summary>
    /// Expéditeur effectif : sur Gmail, toujours SmtpUser (compte authentifié).
    /// Ailleurs, From s'il est renseigné, sinon SmtpUser.
    /// </summary>
    public static string ResolveFromAddress(EmailOptions options)
    {
        var user = options.SmtpUser?.Trim() ?? "";
        var from = string.IsNullOrWhiteSpace(options.From) ? user : options.From.Trim();
        if (IsGmailHost(options.SmtpHost) && !string.IsNullOrEmpty(user))
            return user;
        return string.IsNullOrEmpty(from) ? user : from;
    }

    public static bool IsGmailHost(string? host)
        => !string.IsNullOrWhiteSpace(host)
           && host.Contains("gmail.com", StringComparison.OrdinalIgnoreCase);

    public static bool TryValidateEmail(string email, out string error)
    {
        error = "";
        try
        {
            var addr = new MailAddress(email);
            if (string.IsNullOrWhiteSpace(addr.Address) || !addr.Address.Contains('@'))
            {
                error = $"Adresse e-mail invalide : « {email} ».";
                return false;
            }
            return true;
        }
        catch (FormatException)
        {
            error = $"Adresse e-mail invalide : « {email} ».";
            return false;
        }
    }

    public static string FormatSmtpError(Exception ex)
    {
        var sb = new StringBuilder("Échec SMTP : ");
        sb.Append(ex.Message);
        for (var inner = ex.InnerException; inner != null; inner = inner.InnerException)
            sb.Append(" → ").Append(inner.Message);
        if (ex is SmtpException smtp)
            sb.Append(" (status=").Append(smtp.StatusCode).Append(')');
        return sb.ToString();
    }
}
