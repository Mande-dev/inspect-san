using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Notifications e-mail best-effort sur événements métier.</summary>
public interface IDomainEmailNotifier
{
    /// <summary>Notifie un utilisateur ou tous les actifs d'un rôle.</summary>
    Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default);
    /// <summary>Envoie un e-mail vers une adresse si elle est renseignée.</summary>
    Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default);
}

/// <summary>Résout destinataires Identity puis délègue à l'expéditeur SMTP.</summary>
public class DomainEmailNotifier : IDomainEmailNotifier
{
    private readonly IAppEmailSender _email;
    private readonly UserManager<ApplicationUser> _users;

    /// <summary>Initialise le notificateur avec l'expéditeur et le gestionnaire d'utilisateurs.</summary>
    public DomainEmailNotifier(IAppEmailSender email, UserManager<ApplicationUser> users)
    {
        _email = email;
        _users = users;
    }

    /// <summary>Envoie un e-mail vers une adresse si elle est renseignée.</summary>
    public Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default)
        => string.IsNullOrWhiteSpace(email)
            ? Task.CompletedTask
            : _email.SendAsync(email!, subject, htmlBody, ct);

    /// <summary>Notifie un utilisateur ou tous les actifs d'un rôle.</summary>
    public async Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default)
    {
        if (!string.IsNullOrEmpty(toUserId))
        {
            var u = await _users.FindByIdAsync(toUserId);
            if (u?.Email != null)
                await _email.SendAsync(u.Email, subject, htmlBody, ct);
            return;
        }

        if (!string.IsNullOrEmpty(toRole))
        {
            var list = await _users.Users.AsNoTracking()
                .Where(u => u.Role == toRole && u.Statut == "actif" && u.Email != null)
                .Select(u => u.Email!)
                .ToListAsync(ct);
            foreach (var email in list.Distinct())
                await _email.SendAsync(email, subject, htmlBody, ct);
        }
    }
}
