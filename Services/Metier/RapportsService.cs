using System.Text;
using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class RapportsService : IRapportsService
{
    private static readonly HashSet<string> StatutsApresDepot = new(StringComparer.Ordinal)
    {
        RapportStatuts.Depose,
        RapportStatuts.Accuse,
        RapportStatuts.Transmis,
        RapportStatuts.Traite
    };

    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IDomainEmailNotifier _email;
    private readonly ICurrentUserScope _scope;

    public RapportsService(
        InspectSanDbContext db,
        MockUserStore users,
        IDomainEmailNotifier? email = null,
        ICurrentUserScope? scope = null)
    {
        _db = db;
        _users = users;
        _email = email ?? NullDomainEmailNotifier.Instance;
        _scope = scope ?? UnrestrictedUserScope.Instance;
    }

    public async Task<List<Rapport>> QueryEntitiesAsync()
        => await _db.Rapports.AsNoTracking().ToListAsync();

    public async Task<IReadOnlyList<RapportListDto>> ListAsync()
    {
        var rapports = await _db.Rapports.AsNoTracking().ToListAsync();
        var ecoleIds = rapports.Select(r => r.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);

        var result = new List<RapportListDto>();
        foreach (var r in rapports)
        {
            var equipeId = await ResolveEquipeIdFromFicheIdsAsync(r.FicheIds);
            var peutDeposer = r.Statut == RapportStatuts.Brouillon
                              && r.FicheIds.Count > 0
                              && !(await FindFichesDejaConsommeesAsync(r.FicheIds, excludeRapportId: r.Id)).Any();
            result.Add(new RapportListDto
            {
                Id = r.Id,
                Numero = r.Numero,
                EcoleId = r.EcoleId,
                EcoleNom = noms.GetValueOrDefault(r.EcoleId),
                FicheIds = r.FicheIds.ToList(),
                Synthese = r.Synthese,
                Statut = r.Statut,
                EquipeId = equipeId,
                PeutDeposer = peutDeposer
            });
        }
        return result;
    }

    public async Task<IReadOnlySet<string>> ListFicheIdsConsommeesAsync(string? excludeRapportId = null)
    {
        var rapports = await _db.Rapports.AsNoTracking()
            .Where(r => StatutsApresDepot.Contains(r.Statut)
                        && (excludeRapportId == null || r.Id != excludeRapportId))
            .ToListAsync();

        var set = new HashSet<string>(StringComparer.Ordinal);
        foreach (var r in rapports)
        {
            foreach (var fid in r.FicheIds)
            {
                if (!string.IsNullOrEmpty(fid))
                    set.Add(fid);
            }
        }
        return set;
    }

    public async Task<IReadOnlyList<string>> FindFichesDejaConsommeesAsync(
        IEnumerable<string>? ficheIds, string? excludeRapportId = null)
    {
        var ids = ficheIds?.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct().ToList() ?? [];
        if (ids.Count == 0) return Array.Empty<string>();

        var consommees = await ListFicheIdsConsommeesAsync(excludeRapportId);
        return ids.Where(consommees.Contains).ToList();
    }

    public async Task<string?> ResolveEquipeIdFromFicheIdsAsync(IEnumerable<string>? ficheIds)
    {
        var ids = ficheIds?.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct().ToList() ?? [];
        if (ids.Count == 0) return null;

        var equipeIds = await (
            from f in _db.FichesControle.AsNoTracking()
            join o in _db.OrdresMission.AsNoTracking() on f.OrdreMissionId equals o.Id
            where ids.Contains(f.Id)
            select o.EquipeId
        ).Distinct().ToListAsync();

        if (equipeIds.Count != 1) return null;
        return equipeIds[0];
    }

    public async Task<string> BuildSyntheseAsync(IEnumerable<string>? ficheIds)
    {
        var ids = ficheIds?.Where(id => !string.IsNullOrWhiteSpace(id)).Distinct().ToList() ?? [];
        if (ids.Count == 0)
            return "";

        var fiches = await _db.FichesControle.AsNoTracking()
            .Where(f => ids.Contains(f.Id))
            .ToListAsync();
        if (fiches.Count == 0) return "";

        var ecoleId = fiches[0].EcoleId;
        var ecoleNom = await _db.Ecoles.AsNoTracking()
            .Where(e => e.Id == ecoleId)
            .Select(e => e.Denomination)
            .FirstOrDefaultAsync() ?? ecoleId;

        var sb = new StringBuilder();
        sb.AppendLine($"Synthèse d'inspection portant sur {fiches.Count} fiche(s) de contrôle validée(s) — établissement : {ecoleNom}.");
        foreach (var f in fiches.OrderBy(x => x.Numero))
        {
            var etat = f.SectionBatiments?.EtatGeneral ?? "—";
            var reco = string.IsNullOrWhiteSpace(f.RecommandationPreliminaire) ? "—" : f.RecommandationPreliminaire;
            var obs = string.IsNullOrWhiteSpace(f.Observations) ? "" : $" Observation : {Trim(f.Observations, 120)}";
            sb.AppendLine($"- {f.Numero} : état {etat}, recommandation {reco}.{obs}");
        }
        sb.Append("Conformité partielle observée. À compléter par l'inspecteur.");
        return sb.ToString().Trim();
    }

    private static string Trim(string s, int max)
        => s.Length <= max ? s : s[..max] + "…";

    public async Task<ApiResultDto> SaveAsync(SaveRapportDto dto)
    {
        var ficheIds = dto.FicheIds?.ToList() ?? new List<string>();
        if (ficheIds.Count == 0 && string.IsNullOrWhiteSpace(dto.Id))
            return ApiResultDto.Fail("Sélectionnez au moins une fiche.");

        if (ficheIds.Count > 0)
        {
            var fiches = await _db.FichesControle.AsNoTracking()
                .Where(f => ficheIds.Contains(f.Id))
                .ToListAsync();
            if (fiches.Count != ficheIds.Count)
                return ApiResultDto.Fail("Une ou plusieurs fiches sont introuvables.");
            if (fiches.Any(f => f.Statut != FicheStatuts.Validee))
                return ApiResultDto.Fail("Seules les fiches validées (« Lu et approuvé ») peuvent composer un rapport.");

            var deja = await FindFichesDejaConsommeesAsync(ficheIds, excludeRapportId: dto.Id);
            if (deja.Count > 0)
                return ApiResultDto.Fail(
                    "Une ou plusieurs fiches sont déjà utilisées dans un rapport déposé. Chaque fiche ne peut être déposée qu’une seule fois.");
        }

        string ecoleId = dto.EcoleId ?? "";
        if (string.IsNullOrEmpty(ecoleId) && ficheIds.Count > 0)
            ecoleId = await _db.FichesControle.AsNoTracking()
                .Where(f => f.Id == ficheIds[0])
                .Select(f => f.EcoleId)
                .FirstOrDefaultAsync() ?? "";

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsEcole(ecoleId))
        {
            var equipeId = await ResolveEquipeIdFromFicheIdsAsync(ficheIds);
            if (!scope.AllowsEquipe(equipeId))
                return ApiResultDto.Fail("Accès refusé pour ce rapport / périmètre.");
        }

        var synthese = dto.Synthese ?? "";
        if (string.IsNullOrWhiteSpace(synthese) && ficheIds.Count > 0)
            synthese = await BuildSyntheseAsync(ficheIds);

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Rapports
                .Include(r => r.RapportFiches)
                .FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Rapport introuvable.");
            if (existing.Statut != RapportStatuts.Brouillon)
                return ApiResultDto.Fail("Rapport déjà déposé, modification impossible.");

            existing.EcoleId = ecoleId;
            existing.FicheIds = ficheIds;
            existing.Synthese = synthese;
            _db.RapportFiches.RemoveRange(existing.RapportFiches);
            existing.RapportFiches = ficheIds
                .Select(fid => new RapportFiche { RapportId = existing.Id, FicheControleId = fid })
                .ToList();
            await _db.SaveChangesAsync();
            _users.AddJournal("Rapports", "modification", $"Rapport {existing.Numero} modifié");
        }
        else
        {
            var count = await _db.Rapports.CountAsync();
            var rapport = new Rapport
            {
                Id = NewId("rap"),
                Numero = $"RAP/PEK-MA/{DateTime.UtcNow:yyyy}/{count + 1:0000}",
                EcoleId = ecoleId,
                FicheIds = ficheIds,
                Synthese = synthese,
                Statut = RapportStatuts.Brouillon,
                CreatedAt = DateTime.UtcNow
            };
            foreach (var fid in ficheIds)
                rapport.RapportFiches.Add(new RapportFiche { RapportId = rapport.Id, FicheControleId = fid });
            _db.Rapports.Add(rapport);
            await _db.SaveChangesAsync();
            _users.AddJournal("Rapports", "création", $"Rapport {rapport.Numero} créé");
        }
        return ApiResultDto.Ok("Rapport enregistré.");
    }

    public async Task<ApiResultDto> DeposerAsync(string id, string? userId)
    {
        var r = await _db.Rapports.FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) return ApiResultDto.Fail("Rapport introuvable.");
        if (r.Statut != RapportStatuts.Brouillon)
            return ApiResultDto.Fail("Seuls les rapports brouillon peuvent être déposés.");
        if (r.FicheIds == null || r.FicheIds.Count == 0)
            return ApiResultDto.Fail("Le rapport doit contenir au moins une fiche validée.");

        var deja = await FindFichesDejaConsommeesAsync(r.FicheIds, excludeRapportId: r.Id);
        if (deja.Count > 0)
            return ApiResultDto.Fail(
                "Une ou plusieurs fiches de ce rapport sont déjà utilisées dans un autre rapport déposé. Chaque fiche ne peut être déposée qu’une seule fois.");

        var equipeId = await ResolveEquipeIdFromFicheIdsAsync(r.FicheIds);
        if (string.IsNullOrEmpty(equipeId) && !string.IsNullOrEmpty(userId))
        {
            equipeId = await _db.Users.AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => u.EquipeId)
                .FirstOrDefaultAsync();
        }

        r.Statut = RapportStatuts.Depose;
        r.DeposeLe = DateTime.UtcNow;
        r.DeposePar = userId;
        await _db.SaveChangesAsync();
        _users.AddNotification("Rapport déposé", $"Le rapport {r.Numero} a été déposé au secrétariat.");
        _users.AddJournal(
            "Rapports",
            "dépôt",
            string.IsNullOrEmpty(equipeId)
                ? $"Rapport {r.Numero} déposé"
                : $"Rapport {r.Numero} déposé (équipe {equipeId})",
            userId);
        await _email.NotifyAsync(
            $"Rapport déposé — {r.Numero}",
            $"<p>Le rapport <strong>{r.Numero}</strong> a été déposé au secrétariat.</p>",
            toRole: DataScope.RoleSecretariat);
        return ApiResultDto.Ok("Rapport déposé au secrétariat.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var r = await _db.Rapports.Include(x => x.RapportFiches).FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) return ApiResultDto.Fail("Rapport introuvable.");
        if (r.Statut != RapportStatuts.Brouillon)
            return ApiResultDto.Fail("Seuls les rapports brouillon peuvent être supprimés.");

        _db.RapportFiches.RemoveRange(r.RapportFiches);
        _db.Rapports.Remove(r);
        await _db.SaveChangesAsync();
        _users.AddJournal("Rapports", "suppression", $"Rapport {id} supprimé");
        return ApiResultDto.Ok("Rapport supprimé.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
