using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>Gestion des décisions administratives liées aux fiches validées.</summary>
public interface IDecisionsService
{
    /// <summary>Liste les décisions sous forme de DTO.</summary>
    Task<IReadOnlyList<DecisionListDto>> ListAsync();
    /// <summary>Retourne les entités décision.</summary>
    Task<List<Decision>> QueryEntitiesAsync();
    /// <summary>Liste les fiches validées sans décision associée.</summary>
    Task<IReadOnlyList<FicheListDto>> FichesSansDecisionAsync();
    /// <summary>Retourne les fiches validées sans décision (entités).</summary>
    Task<List<FicheControle>> QueryFichesSansDecisionAsync();
    /// <summary>Crée ou met à jour une décision.</summary>
    Task<ApiResultDto> SaveAsync(SaveDecisionDto dto, string? userId);
    /// <summary>Supprime une décision.</summary>
    Task<ApiResultDto> DeleteAsync(string id);
    /// <summary>Génère le PDF de la lettre de décision et l'envoie au chef d'établissement.</summary>
    Task<ApiResultDto> EnvoyerLettreParMailAsync(string decisionId, string? userId);
}
