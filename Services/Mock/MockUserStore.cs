using inspect_san.Models.Data;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services.Mock;

/// <summary>
/// Journal d'activité et notifications persistés via EF (InspectSanDbContext).
/// Conservé sous ce nom pour compatibilité DI / injections existantes.
/// </summary>
public class MockUserStore
{
    private readonly InspectSanDbContext _db;
    private int _seq;

    /// <summary>Initialise le store avec le contexte EF.</summary>
    public MockUserStore(InspectSanDbContext db) => _db = db;

    public List<NotificationItem> Notifications =>
        _db.Notifications.AsNoTracking()
            .OrderByDescending(n => n.CreatedAt)
            .ToList();

    public List<JournalEntry> JournalActivite =>
        _db.JournalEntries.AsNoTracking()
            .OrderByDescending(j => j.CreatedAt)
            .ToList();

    /// <summary>Retourne les notifications visibles pour un utilisateur.</summary>
    public List<NotificationItem> NotificationsForUser(string? userId)
    {
        var q = _db.Notifications.AsNoTracking().AsQueryable();
        if (!string.IsNullOrEmpty(userId))
            q = q.Where(n => n.UserId == null || n.UserId == userId);
        else
            q = q.Where(n => n.UserId == null);
        return q.OrderByDescending(n => n.CreatedAt).ToList();
    }

    /// <summary>Génère un identifiant unique préfixé.</summary>
    private string Uid(string prefix)
    {
        Interlocked.Increment(ref _seq);
        return $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{_seq}-{Guid.NewGuid():N}"[..36];
    }

    /// <summary>Ajoute une entrée au journal d'activité.</summary>
    public void AddJournal(string module, string action, string detail, string? userId = null)
    {
        _db.JournalEntries.Add(new JournalEntry
        {
            Id = Uid("log"),
            Module = module,
            Action = action,
            Detail = detail,
            UtilisateurId = userId ?? "systeme",
            CreatedAt = DateTime.UtcNow
        });
        _db.SaveChanges();
    }

    /// <summary>Ajoute une notification utilisateur ou globale.</summary>
    public void AddNotification(string titre, string message, string? userId = null)
    {
        _db.Notifications.Add(new NotificationItem
        {
            Id = Uid("ntf"),
            Titre = titre,
            Message = message,
            Lu = false,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        });
        _db.SaveChanges();
    }

    /// <summary>Marque une notification comme lue.</summary>
    public void MarkNotificationRead(string id)
    {
        var n = _db.Notifications.FirstOrDefault(x => x.Id == id);
        if (n != null)
        {
            n.Lu = true;
            _db.SaveChanges();
        }
    }

    /// <summary>Marque comme lues toutes les notifications non lues de l'utilisateur.</summary>
    public void MarkAllNotificationsRead(string? userId = null)
    {
        var q = _db.Notifications.Where(n => !n.Lu);
        if (!string.IsNullOrEmpty(userId))
            q = q.Where(n => n.UserId == null || n.UserId == userId);
        foreach (var n in q.ToList())
            n.Lu = true;
        _db.SaveChanges();
    }
}
