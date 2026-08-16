using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class ChefsService : IChefsService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public ChefsService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    private static IQueryable<Chef> ApplyFilter(IQueryable<Chef> q, ChefFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(c => c.NomComplet.ToLower().Contains(term) || c.IdDinacope.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.EcoleId))
            q = q.Where(c => c.EcoleId == filter.EcoleId);
        return q;
    }

    public async Task<List<Chef>> QueryEntitiesAsync(ChefFilterDto filter)
        => await ApplyFilter(_db.Chefs.AsNoTracking(), filter).ToListAsync();

    public async Task<IReadOnlyList<ChefListDto>> ListAsync(ChefFilterDto filter)
    {
        var chefs = await ApplyFilter(_db.Chefs.AsNoTracking(), filter).ToListAsync();
        var ecoleIds = chefs.Select(c => c.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);
        return chefs.Select(c => Map(c, noms.GetValueOrDefault(c.EcoleId))).ToList();
    }

    public async Task<ChefListDto?> GetAsync(string id)
    {
        var c = await _db.Chefs.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (c == null) return null;
        var nom = await _db.Ecoles.AsNoTracking()
            .Where(e => e.Id == c.EcoleId)
            .Select(e => e.Denomination)
            .FirstOrDefaultAsync();
        return Map(c, nom);
    }

    public async Task<ApiResultDto> SaveAsync(SaveChefDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NomComplet) || string.IsNullOrWhiteSpace(dto.EcoleId))
            return ApiResultDto.Fail("Nom et école obligatoires.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Chefs.FirstOrDefaultAsync(c => c.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Chef introuvable.");
            existing.NomComplet = dto.NomComplet.Trim();
            existing.IdDinacope = dto.IdDinacope?.Trim() ?? "";
            existing.Telephone = dto.Telephone?.Trim() ?? "";
            existing.EcoleId = dto.EcoleId;
            existing.AncienneteEnseignement = dto.AncienneteEnseignement;
            existing.AncienneteChef = dto.AncienneteChef;
            existing.AncienneteEcole = dto.AncienneteEcole;
            await _db.SaveChangesAsync();
            _users.AddJournal("Chefs", "modification", $"Chef {existing.NomComplet} modifié");
        }
        else
        {
            var chef = new Chef
            {
                Id = NewId("chef"),
                NomComplet = dto.NomComplet.Trim(),
                IdDinacope = dto.IdDinacope?.Trim() ?? "",
                Telephone = dto.Telephone?.Trim() ?? "",
                EcoleId = dto.EcoleId,
                AncienneteEnseignement = dto.AncienneteEnseignement,
                AncienneteChef = dto.AncienneteChef,
                AncienneteEcole = dto.AncienneteEcole,
                CreatedAt = DateTime.UtcNow
            };
            _db.Chefs.Add(chef);
            await _db.SaveChangesAsync();
            _users.AddJournal("Chefs", "création", $"Chef {chef.NomComplet} créé");
        }
        return ApiResultDto.Ok("Chef enregistré.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var chef = await _db.Chefs.FirstOrDefaultAsync(c => c.Id == id);
        if (chef != null)
        {
            _db.Chefs.Remove(chef);
            await _db.SaveChangesAsync();
            _users.AddJournal("Chefs", "suppression", $"Chef {id} supprimé");
        }
        return ApiResultDto.Ok("Chef supprimé.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];

    private static ChefListDto Map(Chef c, string? ecoleNom) => new()
    {
        Id = c.Id,
        NomComplet = c.NomComplet,
        IdDinacope = c.IdDinacope,
        Telephone = c.Telephone,
        EcoleId = c.EcoleId,
        EcoleNom = ecoleNom,
        AncienneteEnseignement = c.AncienneteEnseignement,
        AncienneteChef = c.AncienneteChef,
        AncienneteEcole = c.AncienneteEcole
    };
}
