using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class FichesControleService : IFichesControleService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IFileStorageService? _files;
    private readonly IDomainEmailNotifier _email;
    private readonly ICurrentUserScope _scope;
    private readonly IOrdresMissionService? _ordres;

    public FichesControleService(
        InspectSanDbContext db,
        MockUserStore users,
        IFileStorageService? files = null,
        IDomainEmailNotifier? email = null,
        ICurrentUserScope? scope = null,
        IOrdresMissionService? ordres = null)
    {
        _db = db;
        _users = users;
        _files = files;
        _email = email ?? NullDomainEmailNotifier.Instance;
        _scope = scope ?? UnrestrictedUserScope.Instance;
        _ordres = ordres;
    }

    private static IQueryable<FicheControle> ApplyFilter(IQueryable<FicheControle> q, FicheFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(f => f.Numero.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(f => f.Statut == filter.Statut);
        return q;
    }

    public async Task<List<FicheControle>> QueryEntitiesAsync(FicheFilterDto filter)
        => await ApplyFilter(_db.FichesControle.AsNoTracking(), filter)
            .OrderByDescending(f => f.UpdatedAt).ToListAsync();

    public async Task<IReadOnlyList<FicheListDto>> ListAsync(FicheFilterDto filter)
    {
        var fiches = await ApplyFilter(_db.FichesControle.AsNoTracking(), filter)
            .OrderByDescending(f => f.UpdatedAt).ToListAsync();
        var ecoleIds = fiches.Select(f => f.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);
        return fiches.Select(f => new FicheListDto
        {
            Id = f.Id,
            Numero = f.Numero,
            OrdreMissionId = f.OrdreMissionId,
            EcoleId = f.EcoleId,
            EcoleNom = noms.GetValueOrDefault(f.EcoleId),
            Statut = f.Statut,
            EtatGeneral = f.SectionBatiments.EtatGeneral,
            RecommandationPreliminaire = f.RecommandationPreliminaire
        }).ToList();
    }

    private static bool IsOmOperational(string? statut)
        => statut is OrdreStatuts.Signe or OrdreStatuts.EnCours;

    public async Task<ApiResultDto> SaveAsync(SaveFicheControleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.OrdreMissionId))
            return ApiResultDto.Fail("Ordre de mission obligatoire.");

        var ordre = await _db.OrdresMission.FirstOrDefaultAsync(o => o.Id == dto.OrdreMissionId);
        if (ordre == null)
            return ApiResultDto.Fail("Ordre de mission introuvable.");
        if (!IsOmOperational(ordre.Statut))
            return ApiResultDto.Fail("La fiche ne peut être créée/modifiée que sur un ordre signé ou en cours.");

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsOrdre(ordre.EquipeId, ordre.EcoleId))
            return ApiResultDto.Fail("Accès refusé pour cette fiche / périmètre.");

        var photos = new List<PhotoMeta>();
        if (!string.IsNullOrWhiteSpace(dto.PhotosJson))
        {
            try { photos = System.Text.Json.JsonSerializer.Deserialize<List<PhotoMeta>>(dto.PhotosJson) ?? new(); }
            catch { /* ignore */ }
            photos = photos.Where(p => !string.IsNullOrEmpty(p.Url) && !p.Url.StartsWith("blob:", StringComparison.OrdinalIgnoreCase)).ToList();
        }

        var ecoleId = ordre.EcoleId;
        var chefId = await _db.Chefs.AsNoTracking()
            .Where(c => c.EcoleId == ecoleId)
            .Select(c => c.Id)
            .FirstOrDefaultAsync();

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.FichesControle.FirstOrDefaultAsync(f => f.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Fiche introuvable.");
            if (existing.Statut == FicheStatuts.Validee)
                return ApiResultDto.Fail("Une fiche validée ne peut plus être modifiée.");
            if (existing.Statut == FicheStatuts.EnAttenteValidation)
                return ApiResultDto.Fail("Fiche déjà soumise au chef. Validation « Lu et approuvé » en attente.");

            existing.OrdreMissionId = dto.OrdreMissionId;
            existing.EcoleId = ecoleId;
            if (!string.IsNullOrEmpty(chefId)) existing.ChefId = chefId;
            existing.Observations = dto.Observations;
            existing.ProduitsAutres = dto.ProduitsAutres ?? "";
            existing.RecommandationPreliminaire = dto.RecommandationPreliminaire ?? "Maintien";
            if (photos.Count > 0) existing.Photos = photos;
            existing.SectionBatiments = new SectionBatiments
            {
                NombreBatiments = dto.NombreBatiments,
                EtatGeneral = dto.EtatGeneral ?? "Satisfaisant",
                NombreEleves = dto.NombreEleves,
                ToilettesFilles = dto.ToilettesFilles ?? "",
                ToilettesGarcons = dto.ToilettesGarcons ?? ""
            };
            existing.SectionImpact7 = new SectionImpact7
            {
                MontantPercu = dto.MontantPercu ?? "",
                Quantite = dto.Quantite ?? "",
                ProduitsNettoyage = dto.ProduitsNettoyage?.ToList() ?? new List<string>()
            };
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            _users.AddJournal("Fiches", "modification", $"Fiche {existing.Numero} modifiée");
            return ApiResultDto.Ok("Fiche enregistrée.", new { id = existing.Id });
        }
        else
        {
            var count = await _db.FichesControle.CountAsync();
            var fiche = new FicheControle
            {
                Id = NewId("fc"),
                Numero = $"FC/{DateTime.UtcNow:yyyy}/{count + 1:0000}",
                OrdreMissionId = dto.OrdreMissionId,
                EcoleId = ecoleId,
                ChefId = chefId,
                Statut = FicheStatuts.Brouillon,
                Observations = dto.Observations,
                ProduitsAutres = dto.ProduitsAutres ?? "",
                RecommandationPreliminaire = dto.RecommandationPreliminaire ?? "Maintien",
                Photos = photos,
                SectionBatiments = new SectionBatiments
                {
                    NombreBatiments = dto.NombreBatiments,
                    EtatGeneral = dto.EtatGeneral ?? "Satisfaisant",
                    NombreEleves = dto.NombreEleves,
                    ToilettesFilles = dto.ToilettesFilles ?? "",
                    ToilettesGarcons = dto.ToilettesGarcons ?? ""
                },
                SectionImpact7 = new SectionImpact7
                {
                    MontantPercu = dto.MontantPercu ?? "",
                    Quantite = dto.Quantite ?? "",
                    ProduitsNettoyage = dto.ProduitsNettoyage?.ToList() ?? new List<string>()
                },
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.FichesControle.Add(fiche);
            await _db.SaveChangesAsync();
            _users.AddJournal("Fiches", "création", $"Fiche {fiche.Numero} créée");

            if (ordre.Statut == OrdreStatuts.Signe)
            {
                if (_ordres != null)
                    await _ordres.PasserEnCoursAsync(ordre.Id);
                else
                {
                    ordre.Statut = OrdreStatuts.EnCours;
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Ordres de mission", "en cours", $"Ordre {ordre.Numero} passé en cours (1re fiche)");
                }
            }
            return ApiResultDto.Ok("Fiche enregistrée.", new { id = fiche.Id });
        }
    }

    public async Task<ApiResultDto> UploadPhotoAsync(string ficheId, IFormFile file, string? legende = null)
    {
        if (_files == null)
            return ApiResultDto.Fail("Stockage fichiers non configuré.");

        var f = await _db.FichesControle.FirstOrDefaultAsync(x => x.Id == ficheId);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.Statut != FicheStatuts.Brouillon)
            return ApiResultDto.Fail("Upload photos autorisé uniquement sur fiche brouillon.");

        var scope = await _scope.GetAsync();
        var ordre = await _db.OrdresMission.AsNoTracking().FirstOrDefaultAsync(o => o.Id == f.OrdreMissionId);
        if (!scope.Unrestricted && ordre != null && !scope.AllowsOrdre(ordre.EquipeId, ordre.EcoleId))
            return ApiResultDto.Fail("Accès refusé.");

        var (ok, url, error) = await _files.SaveAsync(file, "fiches", ficheId);
        if (!ok) return ApiResultDto.Fail(error ?? "Échec upload.");

        var meta = new PhotoMeta
        {
            Nom = file.FileName,
            Legende = string.IsNullOrWhiteSpace(legende) ? file.FileName : legende!,
            Url = url!
        };
        f.Photos.Add(meta);
        f.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return ApiResultDto.Ok("Photo enregistrée.", meta);
    }

    public async Task<ApiResultDto> SoumettrePourValidationAsync(string id, string? userId)
    {
        var f = await _db.FichesControle.FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.Statut != FicheStatuts.Brouillon)
            return ApiResultDto.Fail("Seules les fiches brouillon peuvent être soumises au chef.");

        f.Statut = FicheStatuts.EnAttenteValidation;
        f.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var chefUserId = await _db.Users.AsNoTracking()
            .Where(u => u.Role == "Chef d'établissement" && u.EcoleId == f.EcoleId)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();
        _users.AddNotification(
            "Fiche à valider",
            $"La fiche {f.Numero} attend votre « Lu et approuvé ».",
            chefUserId);
        _users.AddJournal("Fiches", "soumission", $"Fiche {f.Numero} soumise au chef", userId);
        await _email.NotifyAsync(
            $"Fiche à valider — {f.Numero}",
            $"<p>La fiche <strong>{f.Numero}</strong> attend votre « Lu et approuvé ».</p>",
            toUserId: chefUserId);
        return ApiResultDto.Ok("Fiche soumise au chef d’établissement.");
    }

    public async Task<ApiResultDto> ValiderAsync(string id, string? userId)
    {
        var f = await _db.FichesControle.FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.Statut != FicheStatuts.EnAttenteValidation)
            return ApiResultDto.Fail("Seules les fiches en attente de validation peuvent être approuvées (« Lu et approuvé »).");

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsEcole(f.EcoleId))
            return ApiResultDto.Fail("Accès refusé pour cette fiche.");

        f.Statut = FicheStatuts.Validee;
        f.ValideePar = userId;
        f.ValideeLe = DateTime.UtcNow;
        f.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _users.AddNotification("Fiche validée", $"La fiche {f.Numero} a été validée (Lu et approuvé).");
        _users.AddJournal("Fiches", "validation", $"Fiche {f.Numero} — Lu et approuvé", userId);
        await _email.NotifyAsync(
            $"Fiche validée — {f.Numero}",
            $"<p>La fiche <strong>{f.Numero}</strong> a été validée (Lu et approuvé).</p>",
            toRole: DataScope.RoleControleur);
        return ApiResultDto.Ok("Fiche validée : Lu et approuvé.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var f = await _db.FichesControle.FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.Statut != FicheStatuts.Brouillon)
            return ApiResultDto.Fail("Seules les fiches brouillon peuvent être supprimées.");

        _db.FichesControle.Remove(f);
        await _db.SaveChangesAsync();
        _users.AddJournal("Fiches", "suppression", $"Fiche {id} supprimée");
        return ApiResultDto.Ok("Fiche supprimée.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
