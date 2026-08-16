using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class EcolesService : IEcolesService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IFileStorageService? _files;

    public EcolesService(InspectSanDbContext db, MockUserStore users, IFileStorageService? files = null)
    {
        _db = db;
        _users = users;
        _files = files;
    }

    public async Task<(IReadOnlyList<RefItem> Communes, IReadOnlyList<RefItem> Regimes)> GetLookupsAsync()
    {
        var communes = await _db.Communes.AsNoTracking()
            .OrderBy(c => c.Nom)
            .Select(c => new RefItem
            {
                Id = c.Id,
                Categorie = RefCategories.Communes,
                Nom = c.Nom,
                Code = c.Code,
                Actif = c.Actif
            }).ToListAsync();
        var regimes = await _db.Regimes.AsNoTracking()
            .OrderBy(r => r.Nom)
            .Select(r => new RefItem
            {
                Id = r.Id,
                Categorie = RefCategories.Regimes,
                Nom = r.Nom,
                Code = r.Code,
                Actif = r.Actif
            }).ToListAsync();
        return (communes, regimes);
    }

    private static IQueryable<Ecole> BaseQuery(InspectSanDbContext db)
        => db.Ecoles.AsNoTracking()
            .Include(e => e.Regime)
            .Include(e => e.Commune);

    private static IQueryable<Ecole> ApplyFilter(IQueryable<Ecole> q, EcoleFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(e => e.Denomination.ToLower().Contains(term) || e.IdDinacope.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Commune))
            q = q.Where(e => e.Commune != null && e.Commune.Nom == filter.Commune);
        if (!string.IsNullOrWhiteSpace(filter.Regime))
            q = q.Where(e => e.Regime != null && e.Regime.Nom == filter.Regime);
        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(e => e.Statut == filter.Statut);
        return q;
    }

    public async Task<List<Ecole>> QueryEntitiesAsync(EcoleFilterDto filter)
        => await ApplyFilter(BaseQuery(_db), filter).OrderByDescending(e => e.UpdatedAt).ToListAsync();

    public async Task<IReadOnlyList<EcoleListDto>> ListAsync(EcoleFilterDto filter)
    {
        var list = await ApplyFilter(BaseQuery(_db), filter)
            .OrderByDescending(e => e.UpdatedAt)
            .ToListAsync();
        return list.Select(Map).ToList();
    }

    public async Task<EcoleListDto?> GetAsync(string id)
    {
        var e = await BaseQuery(_db).FirstOrDefaultAsync(x => x.Id == id);
        return e == null ? null : Map(e);
    }

    public async Task<ApiResultDto> SaveAsync(SaveEcoleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Denomination) || string.IsNullOrWhiteSpace(dto.IdDinacope) ||
            string.IsNullOrWhiteSpace(dto.RegimeId) || string.IsNullOrWhiteSpace(dto.CommuneId))
            return ApiResultDto.Fail("Champs obligatoires manquants.");

        if (!await _db.Regimes.AnyAsync(r => r.Id == dto.RegimeId))
            return ApiResultDto.Fail("Régime invalide.");
        if (!await _db.Communes.AnyAsync(c => c.Id == dto.CommuneId))
            return ApiResultDto.Fail("Commune invalide.");

        var docs = new List<DocumentMeta>();
        if (!string.IsNullOrWhiteSpace(dto.DocumentsJson))
        {
            try { docs = System.Text.Json.JsonSerializer.Deserialize<List<DocumentMeta>>(dto.DocumentsJson) ?? new(); }
            catch { /* ignore */ }
        }

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("École introuvable.");

            existing.Denomination = dto.Denomination.Trim();
            existing.RegimeId = dto.RegimeId;
            existing.CommuneId = dto.CommuneId;
            existing.IdDinacope = dto.IdDinacope.Trim();
            existing.NumAgrement = string.IsNullOrWhiteSpace(dto.NumAgrement) ? null : dto.NumAgrement.Trim();
            existing.NumNotification = string.IsNullOrWhiteSpace(dto.NumNotification) ? null : dto.NumNotification.Trim();
            existing.Statut = string.IsNullOrWhiteSpace(dto.Statut) ? EcoleStatuts.Active : dto.Statut;
            if (docs.Count > 0) existing.Documents = docs;
            existing.Adresse = new Adresse
            {
                Quartier = dto.Quartier?.Trim() ?? "",
                Avenue = dto.Avenue?.Trim() ?? "",
                Numero = dto.Numero?.Trim() ?? ""
            };
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            _users.AddJournal("Écoles", "modification", $"École {existing.Denomination} modifiée");
            return ApiResultDto.Ok("École mise à jour.", new { id = existing.Id });
        }

        if (await _db.Ecoles.AnyAsync(e => e.IdDinacope == dto.IdDinacope.Trim()))
            return ApiResultDto.Fail("Cet identifiant DINACOPE est déjà utilisé.");

        var ecole = new Ecole
        {
            Id = NewId("eco"),
            Denomination = dto.Denomination.Trim(),
            RegimeId = dto.RegimeId,
            CommuneId = dto.CommuneId,
            IdDinacope = dto.IdDinacope.Trim(),
            NumAgrement = string.IsNullOrWhiteSpace(dto.NumAgrement) ? null : dto.NumAgrement.Trim(),
            NumNotification = string.IsNullOrWhiteSpace(dto.NumNotification) ? null : dto.NumNotification.Trim(),
            Statut = string.IsNullOrWhiteSpace(dto.Statut) ? EcoleStatuts.Active : dto.Statut,
            Documents = docs,
            Adresse = new Adresse
            {
                Quartier = dto.Quartier?.Trim() ?? "",
                Avenue = dto.Avenue?.Trim() ?? "",
                Numero = dto.Numero?.Trim() ?? ""
            },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Ecoles.Add(ecole);
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "création", $"École {ecole.Denomination} créée");
        return ApiResultDto.Ok("École créée.", new { id = ecole.Id });
    }

    public async Task<ApiResultDto> UploadDocumentAsync(string ecoleId, IFormFile file)
    {
        if (_files == null)
            return ApiResultDto.Fail("Stockage fichiers non configuré.");
        if (string.IsNullOrWhiteSpace(ecoleId))
            return ApiResultDto.Fail("École obligatoire.");

        var ecole = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == ecoleId);
        if (ecole == null) return ApiResultDto.Fail("École introuvable.");

        var (ok, url, error) = await _files.SaveAsync(file, "ecoles", ecoleId);
        if (!ok) return ApiResultDto.Fail(error ?? "Échec upload.");

        var meta = new DocumentMeta
        {
            Nom = file.FileName,
            Taille = FormatSize(file.Length),
            Url = url!,
            Date = DateTime.UtcNow
        };
        ecole.Documents.Add(meta);
        ecole.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "document", $"Document {meta.Nom} ajouté à {ecole.Denomination}");
        return ApiResultDto.Ok("Document enregistré.", meta);
    }

    private static string FormatSize(long bytes)
    {
        if (bytes < 1024) return $"{bytes} o";
        if (bytes < 1024 * 1024) return $"{bytes / 1024.0:0.#} Ko";
        return $"{bytes / (1024.0 * 1024):0.#} Mo";
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var hasFiches = await _db.FichesControle.AnyAsync(f => f.EcoleId == id);
        var hasRapports = await _db.Rapports.AnyAsync(r => r.EcoleId == id);
        if (hasFiches || hasRapports)
            return ApiResultDto.Fail("Suppression impossible : des fiches ou rapports sont liés.", suggestDeactivate: true);

        var ecole = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == id);
        if (ecole == null) return ApiResultDto.Fail("École introuvable.");

        var chefs = await _db.Chefs.Where(c => c.EcoleId == id).ToListAsync();
        var ordres = await _db.OrdresMission.Where(o => o.EcoleId == id).ToListAsync();
        var decisions = await _db.Decisions.Where(d => d.EcoleId == id).ToListAsync();

        _db.Decisions.RemoveRange(decisions);
        _db.OrdresMission.RemoveRange(ordres);
        _db.Chefs.RemoveRange(chefs);
        _db.Ecoles.Remove(ecole);
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "suppression", $"École {ecole.Denomination} supprimée");
        return ApiResultDto.Ok("École supprimée.");
    }

    public async Task<ApiResultDto> DeactivateAsync(string id)
    {
        var e = await _db.Ecoles.FirstOrDefaultAsync(x => x.Id == id);
        if (e == null) return ApiResultDto.Fail("École introuvable.");
        e.Statut = EcoleStatuts.FermetureTemporaire;
        e.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _users.AddJournal("Écoles", "modification", $"École {e.Denomination} désactivée");
        return ApiResultDto.Ok("École désactivée (fermeture temporaire).");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];

    private static EcoleListDto Map(Ecole e) => new()
    {
        Id = e.Id,
        Denomination = e.Denomination,
        Regime = e.Regime?.Nom ?? "",
        RegimeId = e.RegimeId,
        IdDinacope = e.IdDinacope,
        NumAgrement = e.NumAgrement,
        NumNotification = e.NumNotification,
        Commune = e.Commune?.Nom ?? "",
        CommuneId = e.CommuneId,
        Quartier = e.Adresse.Quartier,
        Avenue = e.Adresse.Avenue,
        Numero = e.Adresse.Numero,
        Statut = e.Statut,
        Documents = e.Documents.Select(d => new DocumentMetaDto
        {
            Nom = d.Nom,
            Taille = d.Taille,
            Date = d.Date,
            Url = d.Url
        }).ToList()
    };
}
