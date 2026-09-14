using inspect_san.Interface;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using inspect_san.Services.Mock;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Consultation et filtrage du journal d'activité.</summary>
public class JournalService : IJournalService
{
    private readonly MockUserStore _store;
    private readonly UserManager<ApplicationUser> _userManager;

    /// <summary>Initialise le service journal avec le store et Identity.</summary>
    public JournalService(MockUserStore store, UserManager<ApplicationUser> userManager)
    {
        _store = store;
        _userManager = userManager;
    }

    /// <summary>Applique les filtres texte, utilisateur et module sur le journal.</summary>
    private IEnumerable<JournalEntry> Filter(JournalFilterDto filter)
    {
        var list = _store.JournalActivite.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(filter.Q))
            list = list.Where(j =>
                j.Detail.Contains(filter.Q, StringComparison.OrdinalIgnoreCase) ||
                j.Action.Contains(filter.Q, StringComparison.OrdinalIgnoreCase));
        if (!string.IsNullOrWhiteSpace(filter.UserId))
            list = list.Where(j => j.UtilisateurId == filter.UserId);
        if (!string.IsNullOrWhiteSpace(filter.Module))
            list = list.Where(j => j.Module.Equals(filter.Module, StringComparison.OrdinalIgnoreCase));
        return list;
    }

    /// <summary>Retourne les entités journal correspondant au filtre.</summary>
    public Task<List<JournalEntry>> QueryEntitiesAsync(JournalFilterDto filter) => Task.FromResult(Filter(filter).ToList());

    /// <summary>Liste les entrées de journal enrichies du nom d'utilisateur.</summary>
    public async Task<IReadOnlyList<JournalListDto>> ListAsync(JournalFilterDto filter)
    {
        var names = await _userManager.Users.AsNoTracking()
            .Select(u => new { u.Id, u.Nom })
            .ToDictionaryAsync(u => u.Id, u => u.Nom);

        var list = Filter(filter).Select(j => new JournalListDto
        {
            Id = j.Id,
            UtilisateurId = j.UtilisateurId,
            UtilisateurNom = names.TryGetValue(j.UtilisateurId, out var nom) ? nom : null,
            Module = j.Module,
            Action = j.Action,
            Detail = j.Detail,
            CreatedAt = j.CreatedAt
        }).ToList();
        return list;
    }
}
