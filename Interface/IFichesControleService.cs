using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>Gestion des fiches de contrôle et de leur validation.</summary>
public interface IFichesControleService
{
    /// <summary>Liste les fiches filtrées sous forme de DTO.</summary>
    Task<IReadOnlyList<FicheListDto>> ListAsync(FicheFilterDto filter);
    /// <summary>Retourne les entités fiche correspondant au filtre.</summary>
    Task<List<FicheControle>> QueryEntitiesAsync(FicheFilterDto filter);
    /// <summary>Crée ou met à jour une fiche de contrôle.</summary>
    Task<ApiResultDto> SaveAsync(SaveFicheControleDto dto);
    /// <summary>Ajoute une photo à une fiche de contrôle.</summary>
    Task<ApiResultDto> UploadPhotoAsync(string ficheId, IFormFile file, string? legende = null);
    /// <summary>Soumet une fiche pour validation.</summary>
    Task<ApiResultDto> SoumettrePourValidationAsync(string id, string? userId);
    /// <summary>Valide une fiche en attente.</summary>
    Task<ApiResultDto> ValiderAsync(string id, string? userId);
    /// <summary>Supprime une fiche de contrôle.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
}
