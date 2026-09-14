using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

/// <summary>Consultation du journal d'activité.</summary>
public interface IJournalService
{
    /// <summary>Liste les entrées de journal filtrées sous forme de DTO.</summary>
    Task<IReadOnlyList<JournalListDto>> ListAsync(JournalFilterDto filter);
    /// <summary>Retourne les entités journal correspondant au filtre.</summary>
    Task<List<JournalEntry>> QueryEntitiesAsync(JournalFilterDto filter);
}
