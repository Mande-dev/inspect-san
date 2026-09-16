using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Gestion des fiches de contrôle et de leur validation.</summary>
public class FichesControleService : IFichesControleService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IFileStorageService? _files;
    private readonly ICurrentUserScope _scope;
    private readonly IMissionsService? _missions;
    private readonly IMissionAccessService _access;

    /// <summary>Initialise le service fiches avec ses dépendances.</summary>
    public FichesControleService(
        InspectSanDbContext db,
        MockUserStore users,
        IFileStorageService? files = null,
        ICurrentUserScope? scope = null,
        IMissionsService? missions = null,
        IMissionAccessService? access = null)
    {
        _db = db;
        _users = users;
        _files = files;
        _scope = scope ?? UnrestrictedUserScope.Instance;
        _missions = missions;
        _access = access ?? new MissionAccessService(db);
    }

    /// <summary>Construit la requête des missions portant une fiche.</summary>
    private IQueryable<Mission> FichesQuery()
        => _db.Missions.AsNoTracking()
            .Include(m => m.Ecole)
            .Include(m => m.Photos)
            .Include(m => m.MissionProduits)
            .Include(m => m.MissionOutils)
            .Where(m => m.StatutFiche != null);

    /// <summary>Applique les filtres de recherche sur les fiches.</summary>
    private static IQueryable<Mission> ApplyFilter(IQueryable<Mission> q, FicheFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(m => m.NumOrdre.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(m => m.StatutFiche == filter.Statut);
        return q;
    }

    /// <summary>Retourne les entités fiche correspondant au filtre.</summary>
    public async Task<List<FicheControle>> QueryEntitiesAsync(FicheFilterDto filter)
    {
        var missions = await ApplyFilter(FichesQuery(), filter)
            .OrderByDescending(m => m.CreatedAt).ToListAsync();
        return missions.Select(m => FicheControle.FromMission(m, m.Ecole?.Id)).ToList();
    }

    /// <summary>Liste les fiches filtrées sous forme de DTO.</summary>
    public async Task<IReadOnlyList<FicheListDto>> ListAsync(FicheFilterDto filter)
    {
        var fiches = await QueryEntitiesAsync(filter);
        var ecoleIds = fiches.Select(f => f.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);
        return fiches.Select(f => new FicheListDto
        {
            Id = f.Id,
            Numero = f.Numero,
            MissionId = f.MissionId,
            EcoleId = f.EcoleId,
            EcoleNom = noms.GetValueOrDefault(f.EcoleId),
            Statut = f.Statut,
            EtatGeneral = f.EtatGeneral,
            RecommandationPreliminaire = f.RecommandationPreliminaire,
            MontPer = f.MontPer,
            ControleProduits = f.ControleProduits.Select(cp => new ControleProduitListDto
            {
                ProduitCode = cp.ProduitCode,
                Quantite = cp.Quantite
            }).ToList(),
            ControleOutils = f.ControleOutils.Select(co => new ControleOutilListDto
            {
                OutilCode = co.OutilCode,
                Quantite = co.Quantite
            }).ToList()
        }).ToList();
    }

    /// <summary>Indique si la mission autorise la saisie de fiche.</summary>
    private static bool IsMissionOperational(string? statut)
        => statut is MissionStatuts.Signe or MissionStatuts.EnCours;

    /// <summary>Crée ou met à jour une fiche de contrôle.</summary>
    public async Task<ApiResultDto> SaveAsync(SaveFicheControleDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.MissionId))
            return ApiResultDto.Fail("Mission obligatoire.");

        var mission = await _db.Missions
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .Include(m => m.Photos)
            .Include(m => m.MissionProduits)
            .Include(m => m.MissionOutils)
            .FirstOrDefaultAsync(m => m.Id == dto.MissionId);
        if (mission == null)
            return ApiResultDto.Fail("Mission introuvable.");
        if (!IsMissionOperational(mission.Statut))
            return ApiResultDto.Fail("La fiche ne peut être créée/modifiée que sur une mission signée ou en cours.");

        var agentIds = mission.Affectations.Select(p => p.MatrAgent).ToList();
        var scope = await _scope.GetAsync();
        var ecoleId = mission.Ecole?.Id ?? "";
        if (!scope.Unrestricted && !scope.AllowsFiche(agentIds, ecoleId, null, mission.Id))
            return ApiResultDto.Fail("Accès refusé pour cette fiche / périmètre.");
        if (!_access.CanWriteFromAffectations(mission.Affectations, scope.AgentId, scope.Unrestricted))
            return ApiResultDto.Fail("Vous n'avez pas le droit d'écrire sur cette mission (seul le chef d'équipe).");

        var photos = new List<Photo>();
        if (!string.IsNullOrWhiteSpace(dto.PhotosJson))
        {
            try
            {
                var raw = System.Text.Json.JsonSerializer.Deserialize<List<PhotoJsonDto>>(dto.PhotosJson) ?? new();
                photos = raw
                    .Where(p => !string.IsNullOrEmpty(p.Url) && !p.Url.StartsWith("blob:", StringComparison.OrdinalIgnoreCase))
                    .Select((p, i) =>
                    {
                        var stamp = PhotoStamp(mission.NumOrdre, i + 1);
                        return new Photo
                        {
                            Nom = stamp,
                            Legende = stamp,
                            Url = p.Url!
                        };
                    }).ToList();
            }
            catch { /* ignore */ }
        }

        var controleProduits = NormalizeControleProduits(dto.ControleProduits);
        if (controleProduits.Count > 0)
        {
            var codes = controleProduits.Select(c => c.ProduitCode).ToList();
            var validCount = await _db.Produits.AsNoTracking()
                .CountAsync(p => codes.Contains(p.CodeProduit));
            if (validCount != codes.Count)
                return ApiResultDto.Fail("Un ou plusieurs produits sont invalides.");
        }

        if (controleProduits.Any(c => c.Quantite < 0))
            return ApiResultDto.Fail("La quantité d'un produit ne peut pas être négative.");

        var controleOutils = NormalizeControleOutils(dto);
        if (controleOutils.Count > 0)
        {
            var codes = controleOutils.Select(c => c.OutilCode).ToList();
            var validCount = await _db.Outils.AsNoTracking()
                .CountAsync(o => codes.Contains(o.CodeOutile));
            if (validCount != codes.Count)
                return ApiResultDto.Fail("Un ou plusieurs outils sont invalides.");
        }

        if (controleOutils.Any(c => c.Quantite < 0))
            return ApiResultDto.Fail("La quantité d'un outil ne peut pas être négative.");

        if (dto.ToilettesFilles < 0 || dto.ToilettesGarcons < 0)
            return ApiResultDto.Fail("Le nombre de toilettes ne peut pas être négatif.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Missions
                .Include(m => m.Photos)
                .Include(m => m.MissionProduits)
                .Include(m => m.MissionOutils)
                .FirstOrDefaultAsync(m => m.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Fiche introuvable.");
            if (existing.StatutFiche == FicheStatuts.Validee)
                return ApiResultDto.Fail("Une fiche validée ne peut plus être modifiée.");
            if (existing.StatutFiche == FicheStatuts.EnAttenteValidation)
                return ApiResultDto.Fail("Fiche déjà soumise au chef.");

            ApplyFicheDto(existing, dto, controleProduits, controleOutils);

            if (photos.Count > 0)
            {
                _db.Photos.RemoveRange(existing.Photos);
                foreach (var p in photos)
                {
                    p.FicheControleId = existing.Id;
                    existing.Photos.Add(p);
                }
            }

            await _db.SaveChangesAsync();
            _users.AddJournal("Fiches", "modification", $"Fiche {existing.NumOrdre} modifiée");
            return ApiResultDto.Ok("Fiche enregistrée.", new { id = existing.Id });
        }

        if (mission.StatutFiche != null)
            return ApiResultDto.Fail("Une fiche existe déjà pour cette mission.");

        mission.StatutFiche = FicheStatuts.Brouillon;
        ApplyFicheDto(mission, dto, controleProduits, controleOutils);

        foreach (var p in photos)
        {
            p.FicheControleId = mission.Id;
            mission.Photos.Add(p);
        }

        await _db.SaveChangesAsync();
        _users.AddJournal("Fiches", "création", $"Fiche {mission.NumOrdre} créée");

        if (mission.Statut == MissionStatuts.Signe)
        {
            if (_missions != null)
                await _missions.PasserEnCoursAsync(mission.Id);
            else
            {
                mission.Validite = MissionStatuts.EnCours;
                await _db.SaveChangesAsync();
                _users.AddJournal("Missions", "en cours", $"Mission {mission.NumOrdre} passée en cours (1re fiche)");
            }
        }
        return ApiResultDto.Ok("Fiche enregistrée.", new { id = mission.Id });
    }

    /// <summary>Applique les champs du DTO sur l'entité mission/fiche.</summary>
    private static void ApplyFicheDto(
        Mission m,
        SaveFicheControleDto dto,
        List<SaveControleProduitDto> controleProduits,
        List<SaveControleOutilDto> controleOutils)
    {
        m.NbreBatiment = dto.NombreBatiments;
        m.EtatBatiment = string.IsNullOrWhiteSpace(dto.EtatGeneral) ? "Satisfaisant" : dto.EtatGeneral;
        m.NbrEleve = dto.NombreEleves;
        m.NbrToiletteFille = dto.ToilettesFilles;
        m.NbrToiletteGarcon = dto.ToilettesGarcons;
        m.ProduitsAutres = string.IsNullOrWhiteSpace(dto.ProduitsAutres) ? null : dto.ProduitsAutres.Trim();
        m.ProduitsAutresQuantite = m.ProduitsAutres != null ? dto.ProduitsAutresQuantite : null;
        m.OutilsAutres = string.IsNullOrWhiteSpace(dto.OutilsAutres) ? null : dto.OutilsAutres.Trim();
        m.OutilsAutresQuantite = m.OutilsAutres != null ? dto.OutilsAutresQuantite : null;
        m.Observation = dto.Observations;
        m.RecommandationPreliminaire = dto.RecommandationPreliminaire ?? "Maintien";
        m.MontPer = dto.MontPer;

        m.MissionProduits.Clear();
        foreach (var cp in controleProduits)
        {
            m.MissionProduits.Add(new MissionProduit
            {
                NumOrdre = m.NumOrdre,
                CodeProduit = cp.ProduitCode,
                Quantite = cp.Quantite
            });
        }
        m.CodeProduit = controleProduits.FirstOrDefault()?.ProduitCode;
        m.NbreProduit = controleProduits.Sum(c => c.Quantite);

        m.MissionOutils.Clear();
        foreach (var co in controleOutils)
        {
            m.MissionOutils.Add(new MissionOutil
            {
                NumOrdre = m.NumOrdre,
                CodeOutil = co.OutilCode,
                Quantite = co.Quantite
            });
        }
        m.CodeOutil = controleOutils.FirstOrDefault()?.OutilCode;
        m.NbreOutil = controleOutils.Sum(c => c.Quantite);
    }

    /// <summary>Normalise la liste des produits contrôlés.</summary>
    private static List<SaveControleProduitDto> NormalizeControleProduits(List<SaveControleProduitDto>? raw)
        => (raw ?? [])
            .Where(c => c.ProduitCode > 0)
            .GroupBy(c => c.ProduitCode)
            .Select(g => new SaveControleProduitDto
            {
                ProduitCode = g.Key,
                Quantite = g.Last().Quantite
            })
            .ToList();

    /// <summary>Normalise la liste des outils contrôlés.</summary>
    private static List<SaveControleOutilDto> NormalizeControleOutils(SaveFicheControleDto dto)
    {
        var fromList = (dto.ControleOutils ?? [])
            .Where(c => c.OutilCode > 0)
            .GroupBy(c => c.OutilCode)
            .Select(g => new SaveControleOutilDto
            {
                OutilCode = g.Key,
                Quantite = g.Last().Quantite
            })
            .ToList();
        if (fromList.Count > 0)
            return fromList;
        if (dto.CodeOutil is > 0)
            return [new SaveControleOutilDto { OutilCode = dto.CodeOutil.Value, Quantite = dto.NbreOutil }];
        return [];
    }
    /// <summary>Ajoute une photo à une fiche de contrôle.</summary>
    public async Task<ApiResultDto> UploadPhotoAsync(string ficheId, IFormFile file, string? legende = null)
    {
        if (_files == null)
            return ApiResultDto.Fail("Stockage fichiers non configuré.");

        var f = await _db.Missions
            .Include(x => x.Photos)
            .Include(x => x.Affectations)
            .Include(x => x.Ecole)
            .FirstOrDefaultAsync(x => x.Id == ficheId);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.StatutFiche != FicheStatuts.Brouillon)
            return ApiResultDto.Fail("Upload photos autorisé uniquement sur fiche brouillon.");

        var scope = await _scope.GetAsync();
        var agentIds = f.Affectations.Select(p => p.MatrAgent);
        var ecoleId = f.Ecole?.Id ?? "";
        if (!scope.Unrestricted && !scope.AllowsFiche(agentIds, ecoleId, null, f.Id))
            return ApiResultDto.Fail("Accès refusé.");
        if (!_access.CanWriteFromAffectations(f.Affectations, scope.AgentId, scope.Unrestricted))
            return ApiResultDto.Fail("Vous n'avez pas le droit d'écrire sur cette mission.");

        var (ok, url, error) = await _files.SaveAsync(file, "fiches", ficheId);
        if (!ok) return ApiResultDto.Fail(error ?? "Échec upload.");

        var index = f.Photos.Count + 1;
        var stamp = PhotoStamp(f.NumOrdre, index);
        var photo = new Photo
        {
            FicheControleId = ficheId,
            Nom = stamp,
            Legende = stamp,
            Url = url!
        };
        f.Photos.Add(photo);
        await _db.SaveChangesAsync();
        return ApiResultDto.Ok("Photo enregistrée.", new { photo.Nom, photo.Legende, photo.Url, NumOrdre = f.NumOrdre, MissionId = f.Id });
    }

    /// <summary>Soumet une fiche pour validation.</summary>
    public async Task<ApiResultDto> SoumettrePourValidationAsync(string id, string? userId)
    {
        var f = await _db.Missions.Include(m => m.Ecole).Include(m => m.Affectations)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.StatutFiche != FicheStatuts.Brouillon)
            return ApiResultDto.Fail("Seules les fiches brouillon peuvent être soumises au chef.");

        var scope = await _scope.GetAsync();
        if (!_access.CanWriteFromAffectations(f.Affectations, scope.AgentId, scope.Unrestricted))
            return ApiResultDto.Fail("Vous n'avez pas le droit de soumettre cette fiche.");

        f.StatutFiche = FicheStatuts.EnAttenteValidation;
        await _db.SaveChangesAsync();

        _users.AddNotification(
            "Fiche à valider",
            $"La fiche {f.NumOrdre} attend le « Lu et approuvé » du chef d'établissement (circuit tablette).");
        _users.AddJournal("Fiches", "soumission",
            $"Fiche {f.NumOrdre} soumise pour validation chef (tablette) — agent {userId}", userId);
        return ApiResultDto.Ok("Fiche prête pour validation par le chef d'établissement (tablette).");
    }

    /// <summary>Valide une fiche en attente.</summary>
    public async Task<ApiResultDto> ValiderAsync(string id, string? userId)
    {
        var f = await _db.Missions
            .Include(m => m.Ecole)!.ThenInclude(e => e!.ChefEtablissement)
            .Include(m => m.Affectations)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.StatutFiche != FicheStatuts.EnAttenteValidation)
            return ApiResultDto.Fail("Seules les fiches en attente de validation peuvent être approuvées.");

        var scope = await _scope.GetAsync();
        if (!_access.CanWriteFromAffectations(f.Affectations, scope.AgentId, scope.Unrestricted))
            return ApiResultDto.Fail("Accès refusé : seul le chef d'équipe peut enregistrer la validation tablette.");

        var chefNom = f.Ecole?.ChefEtablissement?.NomComplet ?? "chef d'établissement";
        f.StatutFiche = FicheStatuts.Validee;
        f.ValideePar = userId;
        f.ValideeLe = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _users.AddNotification("Fiche validée", $"La fiche {f.NumOrdre} a été validée (Lu et approuvé) — {chefNom}.");
        _users.AddJournal("Fiches", "validation tablette",
            $"Fiche {f.NumOrdre} — Lu et approuvé par {chefNom} (enregistré par agent {userId})", userId);
        return ApiResultDto.Ok("Fiche validée : Lu et approuvé.");
    }

    /// <summary>Supprime une fiche de contrôle.</summary>
    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var f = await _db.Missions
            .Include(x => x.Photos)
            .Include(x => x.MissionProduits)
            .Include(x => x.MissionOutils)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (f == null) return ApiResultDto.Fail("Fiche introuvable.");
        if (f.StatutFiche != FicheStatuts.Brouillon)
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Cette fiche de contrôle ne peut plus être retirée.",
                "Elle a déjà été soumise ou validée dans le circuit administratif.\n\n" +
                "Seules les fiches encore en préparation (brouillon) peuvent être annulées.");

        _db.Photos.RemoveRange(f.Photos);
        f.MissionProduits.Clear();
        f.MissionOutils.Clear();
        f.StatutFiche = null;
        f.NbreBatiment = 0;
        f.NbrEleve = 0;
        f.Observation = null;
        f.CodeProduit = null;
        f.NbreProduit = 0;
        f.CodeOutil = null;
        f.NbreOutil = 0;
        await _db.SaveChangesAsync();
        _users.AddJournal("Fiches", "suppression", $"Fiche {id} supprimée");
        return ApiResultDto.Ok("Fiche supprimée.");
    }

    /// <summary>Nom stocké en BDD : N° mission (NumOrdre) + rang d'ajout de la photo.</summary>
    private static string PhotoStamp(string numOrdre, int index)
        => $"{numOrdre}-{index}";

    /// <summary>DTO JSON interne pour les métadonnées de photo.</summary>
    private sealed class PhotoJsonDto
    {
        public string? Nom { get; set; }
        public string? Legende { get; set; }
        public string? Url { get; set; }
    }
}
