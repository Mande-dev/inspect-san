namespace inspect_san.Services;

/// <summary>Fallbacks pour tests / construction manuelle des services.</summary>
public sealed class NullDomainEmailNotifier : IDomainEmailNotifier
{
    public static readonly NullDomainEmailNotifier Instance = new();
    /// <summary>No-op : ignore toute notification utilisateur ou rôle.</summary>
    public Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default)
        => Task.CompletedTask;
    /// <summary>No-op : ignore tout envoi vers une adresse e-mail.</summary>
    public Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default)
        => Task.CompletedTask;
}

/// <summary>Collecte les e-mails pour les tests.</summary>
public sealed class RecordingEmailNotifier : IDomainEmailNotifier
{
    public List<(string Subject, string? UserId, string? Role, string? Email)> Sent { get; } = new();

    /// <summary>Enregistre une notification ciblée utilisateur ou rôle.</summary>
    public Task NotifyAsync(string subject, string htmlBody, string? toUserId = null, string? toRole = null, CancellationToken ct = default)
    {
        Sent.Add((subject, toUserId, toRole, null));
        return Task.CompletedTask;
    }

    /// <summary>Enregistre une notification adressée à une adresse e-mail.</summary>
    public Task NotifyEmailAsync(string? email, string subject, string htmlBody, CancellationToken ct = default)
    {
        Sent.Add((subject, null, null, email));
        return Task.CompletedTask;
    }
}
