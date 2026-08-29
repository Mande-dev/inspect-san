using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class EcolesService : IEcolesService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public EcolesService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    public async Task<(IReadOnlyList<RefItem> Sousproveds, IReadOnlyList<RefItem> Regimes)> GetLookupsAsync()
    {
        var sous = await _db.SousProvinces.AsNoTracking()
            .OrderBy(s => s.Code)
            .Select(s => new RefItem
            {
                Categorie = "sous_division",
                Nom = s.Libelle,
                Code = s.Code
            }).ToListAsync();
        if (sous.Count == 0)
        {
            sous = SousProvinceCatalog.Rows.Select(r => new RefItem
            {
                Categorie = "sous_division",
                Nom = r.Libelle,
                Code = r.Code
            }).ToList();
        }
        var reg = RegGes.All.Select(code => new RefItem
        {
            Categorie = "reg_ges",
            Nom = RegGes.LabelOf(code),
            Code = code
        }).ToList();
        return (sous, reg);
    }

    public async Task<IReadOnlyList<RefItem>> GetCategoriesAsync()
        => await _db.Categories.AsNoTracking()
            .OrderBy(c => c.Designation)
            .Select(c => new RefItem
            {
                Code = c.CodeCategories.ToString(),
                Nom = c.Designation,
                Categorie = RefCategories.Categories
            }).ToListAsync();

    private static IQueryable<Ecole> BaseQuery(InspectSanDbContext db)
        => db.Ecoles.AsNoTracking().Include(e => e.Categorie);

    private static IQueryable<Ecole> ApplyFilter(IQueryable<Ecole> q, EcoleFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(e => e.Denomination.ToLower().Contains(term) || e.IdDinacope.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Sousproved))
        {
            var code = SousProvinceCatalog.CodeFromLegacyOrCode(filter.Sousproved) ?? filter.Sousproved;
            q = q.Where(e => e.SousDivision == code);
        }
        if (!string.IsNullOrWhiteSpace(filter.Regime))
        {
            var code = RegGes.Labels.FirstOrDefault(kv => kv.Value == filter.Regime).Key ?? filter.Regime;
            q = q.Where(e => e.RegGes == code);
        }
        return q;
    }

    public async Task<List<Ecole>> QueryEntitiesAsync(EcoleFilterDto filter)
        => await ApplyFilter(BaseQuery(_db), filter).OrderByDescending(e => e.Denomination).ToListAsync();

    public async Task<IReadOnlyList<EcoleListDto>> ListAsync(EcoleFilterDto filter)
    {
        var list = await ApplyFilter(BaseQuery(_db), filter)
            .OrderByDescending(e => e.Denomination)
            .ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<EcoleListDto?> GetAsync(string id)
    {
        var e = await BaseQuery(_db).FirstOrDefaultAsync(x => x.Id == id);
        return e == null ? null : Map(e);
    }

    public async Task<Ecole?> GetEntityByIdAsync(string id)
        => await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == id);

    public async Task<ApiResultDto> SaveAsync(SaveEcoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Denomination) || string.IsNullOrWhiteSpace(dto.IdDinacope)
            || string.IsNullOrWhiteSpace(dto.RegGes) || string.IsNullOrWhiteSpace(dto.SousDivision)
            || dto.CodeCategories <= 0)
            return ApiResultDto.Fail("Champs obligatoires manquants.");

        if (!RegGes.IsValid(dto.RegGes))
            return ApiResultDto.Fail("Régime invalide.");
        var sousCode = SousProvinceCatalog.CodeFromLegacyOrCode(dto.SousDivision)
                       ?? dto.SousDivision.Trim();
        if (!await _db.SousProvinces.AnyAsync(s => s.Code == sousCode)
            && !SousDivision.IsValid(sousCode))
            return ApiResultDto.Fail("Sous-division invalide.");
        if (!await _db.Categories.AnyAsync(c => c.CodeCategories == dto.CodeCategories))
            return ApiResultDto.Fail("Catégorie invalide.");

        string? matriculeChef = string.IsNullOrWhiteSpace(dto.MatriculeChef) ? null : dto.MatriculeChef.Trim();
        if (matriculeChef != null && !await _db.ChefEtablissements.AnyAsync(p => p.Matricule == matriculeChef))
            return ApiResultDto.Fail("Chef d'établissement invalide.");

        var numAgrement = string.IsNullOrWhiteSpace(dto.NumAgrement)
            ? $"AGR-{DateTime.UtcNow:yyyyMMddHHmmss}"
            : dto.NumAgrement.Trim();

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Établissement introuvable.");

            if (existing.NumAgrement != numAgrement
                && await _db.Ecoles.AnyAsync(e => e.NumAgrement == numAgrement))
                return ApiResultDto.Fail("Numéro d'agrément déjà utilisé.");

            existing.Denomination = dto.Denomination.Trim();
            existing.RegGes = dto.RegGes;
            existing.SousDivision = sousCode;
            existing.CodeCategories = dto.CodeCategories;
            existing.IdDinacope = dto.IdDinacope.Trim();
            existing.NumAgrement = numAgrement;
            existing.NumNotification = string.IsNullOrWhiteSpace(dto.NumNotification) ? null : dto.NumNotification.Trim();
            existing.Adresse = dto.Adresse?.Trim() ?? "";
            existing.MatriculeChef = matriculeChef;
            await _db.SaveChangesAsync();
            _users.AddJournal("Écoles", "modification", $"Établissement {existing.Denomination} modifié");
            return ApiResultDto.Ok("Établissement mis à jour.", new { id = existing.Id });
        }

        if (await _db.Ecoles.AnyAsync(e => e.IdDinacope == dto.IdDinacope.Trim()))
            return ApiResultDto.Fail("Cet identifiant DINACOPE est déjà utilisé.");
        if (await _db.Ecoles.AnyAsync(e => e.NumAgrement == numAgrement))
            return ApiResultDto.Fail("Numéro d'agrément déjà utilisé.");

        var ecole = new Ecole
        {
            Id = NewId("eco"),
            NumAgrement = numAgrement,
            Denomination = dto.Denomination.Trim(),
            RegGes = dto.RegGes,
            SousDivision = sousCode,
            CodeCategories = dto.CodeCategories,
            IdDinacope = dto.IdDinacope.Trim(),
            NumNotification = string.IsNullOrWhiteSpace(dto.NumNotification) ? null : dto.NumNotification.Trim(),
            Adresse = dto.Adresse?.Trim() ?? "",
            MatriculeChef = matriculeChef
        };
        _db.Ecoles.Add(ecole);
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "création", $"Établissement {ecole.Denomination} créé");
        return ApiResultDto.Ok("Établissement créé.", new { id = ecole.Id });
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var ecole = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == id);
        if (ecole == null) return ApiResultDto.Fail("Établissement introuvable.");

        var hasMissions = await _db.Missions.AnyAsync(m => m.NumAgrement == ecole.NumAgrement);
        if (hasMissions)
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Cet établissement ne peut pas être retiré du fichier pour le moment.",
                "Des missions d'inspection ont déjà été ouvertes pour cet établissement.\n\n" +
                "La suppression définitive n'est pas possible tant que ces missions existent dans le dossier administratif.",
                suggestDeactivate: true);

        var decisions = await _db.Decisions.Where(d => d.NumAgrement == ecole.NumAgrement).ToListAsync();
        _db.Decisions.RemoveRange(decisions);
        _db.Ecoles.Remove(ecole);
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "suppression", $"Établissement {ecole.Denomination} supprimé");
        return ApiResultDto.Ok("Établissement supprimé.");
    }

    public Task<ApiResultDto> DeactivateAsync(string id)
        => Task.FromResult(ApiResultDto.Fail("Désactivation non disponible sur cette structure."));

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];

    private static EcoleListDto Map(Ecole e) => new()
    {
        Id = e.Id,
        NumAgrement = e.NumAgrement,
        Denomination = e.Denomination,
        Regime = RegGes.LabelOf(e.RegGes),
        RegGes = e.RegGes,
        IdDinacope = e.IdDinacope,
        NumNotification = e.NumNotification,
        Sousproved = SousDivision.LabelOf(e.SousDivision),
        SousDivision = e.SousDivision,
        CodeCategories = e.CodeCategories,
        Categorie = e.Categorie?.Designation ?? "",
        Adresse = e.Adresse,
        MatriculeChef = e.MatriculeChef
    };
}
