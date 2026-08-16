using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class ControleursService : IControleursService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public ControleursService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    private static IQueryable<Controleur> ApplyFilter(IQueryable<Controleur> q, ControleurFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(c => c.NomComplet.ToLower().Contains(term)
                             || (c.Telephone != null && c.Telephone.ToLower().Contains(term)));
        }
        if (!string.IsNullOrWhiteSpace(filter.EquipeId))
            q = q.Where(c => c.EquipeId == filter.EquipeId);
        return q;
    }

    public async Task<List<Controleur>> QueryEntitiesAsync(ControleurFilterDto filter)
        => await ApplyFilter(
                _db.Controleurs.AsNoTracking().Include(c => c.Equipe),
                filter)
            .OrderBy(c => c.NomComplet)
            .ToListAsync();

    public async Task<IReadOnlyList<ControleurListDto>> ListAsync(ControleurFilterDto filter)
    {
        var chefIds = await _db.Equipes.AsNoTracking()
            .Where(e => e.ChefControleurId != null)
            .Select(e => e.ChefControleurId!)
            .ToListAsync();

        var list = await QueryEntitiesAsync(filter);
        return list.Select(c => new ControleurListDto
        {
            Id = c.Id,
            NomComplet = c.NomComplet,
            Telephone = c.Telephone,
            EquipeId = c.EquipeId,
            EquipeNom = c.Equipe?.Nom,
            Actif = c.Actif,
            EstChefEquipe = chefIds.Contains(c.Id)
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(SaveControleurDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NomComplet) || string.IsNullOrWhiteSpace(dto.EquipeId))
            return ApiResultDto.Fail("Nom et équipe obligatoires.");

        if (!await _db.Equipes.AnyAsync(e => e.Id == dto.EquipeId))
            return ApiResultDto.Fail("Équipe invalide.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Controleurs.FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Contrôleur introuvable.");

            var isChef = await _db.Equipes.AnyAsync(e => e.ChefControleurId == existing.Id);
            if (isChef && existing.EquipeId != dto.EquipeId)
                return ApiResultDto.Fail("Impossible de changer l’équipe d’un chef d’équipe. Re-désignez d’abord le chef.");

            existing.NomComplet = dto.NomComplet.Trim();
            existing.Telephone = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim();
            existing.EquipeId = dto.EquipeId;
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Contrôleurs", "modification", $"Contrôleur {existing.NomComplet} modifié");
        }
        else
        {
            var ctrl = new Controleur
            {
                Id = NewId("ctrl"),
                NomComplet = dto.NomComplet.Trim(),
                Telephone = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim(),
                EquipeId = dto.EquipeId,
                Actif = dto.Actif,
                CreatedAt = DateTime.UtcNow
            };
            _db.Controleurs.Add(ctrl);
            await _db.SaveChangesAsync();
            _users.AddJournal("Contrôleurs", "création", $"Contrôleur {ctrl.NomComplet} créé");
        }
        return ApiResultDto.Ok("Contrôleur enregistré.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var c = await _db.Controleurs.FirstOrDefaultAsync(x => x.Id == id);
        if (c == null)
            return ApiResultDto.Ok("Contrôleur déjà absent.");

        if (await _db.Equipes.AnyAsync(e => e.ChefControleurId == id))
            return ApiResultDto.Fail("Ce membre est chef d’équipe. Re-désignez un autre chef avant suppression.");

        if (await _db.Users.AnyAsync(u => u.ControleurId == id))
            return ApiResultDto.Fail("Ce membre est lié à un compte utilisateur.");

        _db.Controleurs.Remove(c);
        await _db.SaveChangesAsync();
        _users.AddJournal("Contrôleurs", "suppression", $"Contrôleur {c.NomComplet} supprimé");
        return ApiResultDto.Ok("Contrôleur supprimé.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
