using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class AgentsService : IAgentsService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public AgentsService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    private static IQueryable<Agent> ApplyFilter(IQueryable<Agent> q, AgentFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(a => a.NomAgent.ToLower().Contains(term)
                             || a.MatrAgent.ToLower().Contains(term)
                             || (a.TelAgent != null && a.TelAgent.ToLower().Contains(term)));
        }
        if (filter.Actif.HasValue)
            q = q.Where(a => a.Actif == filter.Actif.Value);
        return q;
    }

    public async Task<List<Agent>> QueryEntitiesAsync(AgentFilterDto filter)
        => await ApplyFilter(_db.Agents.AsNoTracking(), filter)
            .OrderBy(a => a.NomAgent)
            .ToListAsync();

    public async Task<IReadOnlyList<AgentListDto>> ListAsync(AgentFilterDto filter)
    {
        var list = await QueryEntitiesAsync(filter);
        return list.Select(a => new AgentListDto
        {
            Id = a.MatrAgent,
            NomComplet = a.NomAgent,
            Telephone = a.TelAgent,
            Actif = a.Actif
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(SaveAgentDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NomComplet))
            return ApiResultDto.Fail("Nom obligatoire.");

        // Id renseigné = modification ; Id vide = création (même modèle que les chefs).
        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Agents.FirstOrDefaultAsync(a => a.MatrAgent == dto.Id);
            if (existing == null)
                return ApiResultDto.Fail("Agent introuvable.");

            existing.NomAgent = dto.NomComplet.Trim();
            existing.TelAgent = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim();
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Agents", "modification", $"Agent {existing.NomAgent} modifié");
            return ApiResultDto.Ok("Agent enregistré.");
        }

        var matricule = (dto.Matricule ?? "").Trim();
        if (string.IsNullOrWhiteSpace(matricule))
            return ApiResultDto.Fail("Matricule obligatoire.");

        if (await _db.Agents.AnyAsync(a => a.MatrAgent == matricule))
            return ApiResultDto.Fail("Ce matricule est déjà utilisé.");

        var agent = new Agent
        {
            MatrAgent = matricule,
            NomAgent = dto.NomComplet.Trim(),
            TelAgent = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim(),
            Actif = dto.Actif
        };
        _db.Agents.Add(agent);
        await _db.SaveChangesAsync();
        _users.AddJournal("Agents", "création", $"Agent {agent.NomAgent} créé");
        return ApiResultDto.Ok("Agent enregistré.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var a = await _db.Agents.FirstOrDefaultAsync(x => x.MatrAgent == id);
        if (a == null)
            return ApiResultDto.Ok("Agent déjà absent.");

        if (await _db.Affectations.AnyAsync(p => p.MatrAgent == id))
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Cet agent ne peut pas être retiré du vivier pour le moment.",
                "Il figure déjà sur une ou plusieurs missions d'inspection.\n\n" +
                "Pour le retirer, il faut d'abord le retirer des missions concernées, ou attendre la clôture administrative de ces missions.");

        if (await _db.Users.AnyAsync(u => u.AgentId == id))
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Cet agent ne peut pas être retiré du vivier pour le moment.",
                "Un compte utilisateur est encore rattaché à cet agent.\n\n" +
                "Désactivez ou détachez d'abord le compte dans la gestion des utilisateurs, puis réessayez.");

        _db.Agents.Remove(a);
        await _db.SaveChangesAsync();
        _users.AddJournal("Agents", "suppression", $"Agent {a.NomAgent} supprimé");
        return ApiResultDto.Ok("Agent supprimé.");
    }
}
