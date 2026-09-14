using inspect_san.Models.DTOs;

namespace inspect_san.Interface;

/// <summary>Gestion de l'état de lecture des notifications.</summary>
public interface INotificationsService
{
    /// <summary>Marque une notification comme lue.</summary>
    Task<ApiResultDto> MarkReadAsync(string id, string? userId = null);
    /// <summary>Marque toutes les notifications de l'utilisateur comme lues.</summary>
    Task<ApiResultDto> MarkAllReadAsync(string? userId = null);
}
