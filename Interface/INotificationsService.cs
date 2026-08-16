using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

public interface INotificationsService
{
    Task<ApiResultDto> MarkReadAsync(string id, string? userId = null);
    Task<ApiResultDto> MarkAllReadAsync(string? userId = null);
}
