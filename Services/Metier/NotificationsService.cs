using inspect_san.Models.DTOs;
using inspect_san.Interface;
using inspect_san.Services.Mock;

namespace inspect_san.Services;

public class NotificationsService : INotificationsService
{
    private readonly MockUserStore _store;
    public NotificationsService(MockUserStore store) => _store = store;

    public Task<ApiResultDto> MarkReadAsync(string id, string? userId = null)
    {
        _store.MarkNotificationRead(id);
        return Task.FromResult(ApiResultDto.Ok("Notification lue."));
    }

    public Task<ApiResultDto> MarkAllReadAsync(string? userId = null)
    {
        _store.MarkAllNotificationsRead(userId);
        return Task.FromResult(ApiResultDto.Ok("Notifications marquées comme lues."));
    }
}
