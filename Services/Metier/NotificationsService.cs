using inspect_san.Models.DTOs;
using inspect_san.Interface;
using inspect_san.Services.Mock;

namespace inspect_san.Services;

/// <summary>Service de marquage des notifications comme lues.</summary>
public class NotificationsService : INotificationsService
{
    private readonly MockUserStore _store;
    /// <summary>Initialise le service avec le store de notifications.</summary>
    public NotificationsService(MockUserStore store) => _store = store;

    /// <summary>Marque une notification comme lue.</summary>
    public Task<ApiResultDto> MarkReadAsync(string id, string? userId = null)
    {
        _store.MarkNotificationRead(id);
        return Task.FromResult(ApiResultDto.Ok("Notification lue."));
    }

    /// <summary>Marque toutes les notifications de l'utilisateur comme lues.</summary>
    public Task<ApiResultDto> MarkAllReadAsync(string? userId = null)
    {
        _store.MarkAllNotificationsRead(userId);
        return Task.FromResult(ApiResultDto.Ok("Notifications marquées comme lues."));
    }
}
