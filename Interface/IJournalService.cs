using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;

namespace inspect_san.Interface;

public interface IJournalService
{
    Task<IReadOnlyList<JournalListDto>> ListAsync(JournalFilterDto filter);
    Task<List<JournalEntry>> QueryEntitiesAsync(JournalFilterDto filter);
}
