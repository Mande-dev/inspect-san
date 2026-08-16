using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Helpers;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class OrdresMissionService : IOrdresMissionService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IDomainEmailNotifier _email;
    private readonly ICurrentUserScope _scope;

    public OrdresMissionService(
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

    private static IQueryable<OrdreMission> ApplyFilter(IQueryable<OrdreMission> q, OrdreFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(o => o.Numero.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(o => o.Statut == filter.Statut);
        return q;
    }

    public async Task<List<OrdreMission>> QueryEntitiesAsync(OrdreFilterDto filter)
        => await ApplyFilter(_db.OrdresMission.AsNoTracking(), filter)
            .OrderByDescending(o => o.CreatedAt).ToListAsync();

    public async Task<IReadOnlyList<OrdreListDto>> ListAsync(OrdreFilterDto filter)
    {
        var ordres = await ApplyFilter(
                _db.OrdresMission.AsNoTracking().Include(o => o.Equipe).Include(o => o.Ecole),
                filter)
            .OrderByDescending(o => o.CreatedAt).ToListAsync();
        return ordres.Select(o => new OrdreListDto
        {
            Id = o.Id,
            Numero = o.Numero,
            EcoleId = o.EcoleId,
            EcoleNom = o.Ecole?.Denomination,
            EquipeId = o.EquipeId,
            EquipeNom = o.Equipe?.Nom,
            Statut = o.Statut,
            DateEmission = o.DateEmission,
            DebutValidite = o.DebutValidite,
            FinValidite = o.FinValidite,
            Objet = o.Objet
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(SaveOrdreMissionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EcoleId))
            return ApiResultDto.Fail("École obligatoire.");
        if (string.IsNullOrWhiteSpace(dto.EquipeId))
            return ApiResultDto.Fail("Équipe obligatoire.");
        if (!await _db.Equipes.AnyAsync(e => e.Id == dto.EquipeId))
            return ApiResultDto.Fail("Équipe invalide.");
        if (!await _db.Ecoles.AnyAsync(e => e.Id == dto.EcoleId))
            return ApiResultDto.Fail("École invalide.");

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsOrdre(dto.EquipeId, dto.EcoleId))
            return ApiResultDto.Fail("Accès refusé pour cet ordre / périmètre.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.OrdresMission.FirstOrDefaultAsync(o => o.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Ordre introuvable.");
            if (existing.Statut is OrdreStatuts.Cloture)
                return ApiResultDto.Fail("Ordre clôturé : modification impossible.");

            existing.EcoleId = dto.EcoleId;
            existing.EquipeId = dto.EquipeId;
            // Les transitions de statut passent par les méthodes dédiées (sauf brouillon libre).
            if (!string.IsNullOrWhiteSpace(dto.Statut)
                && existing.Statut == OrdreStatuts.Brouillon
                && dto.Statut is OrdreStatuts.Brouillon or OrdreStatuts.EnAttenteSignature)
                existing.Statut = dto.Statut;
            existing.DateEmission = dto.DateEmission;
            existing.DebutValidite = dto.DebutValidite;
            existing.FinValidite = dto.FinValidite;
            existing.Objet = dto.Objet;
            await _db.SaveChangesAsync();
            _users.AddJournal("Ordres de mission", "modification", $"Ordre {existing.Numero} modifié");
        }
        else
        {
            var ordre = new OrdreMission
            {
                Id = NewId("om"),
                Numero = await NumeroGenerator.NextOrdreMissionAsync(_db),
                EcoleId = dto.EcoleId,
                EquipeId = dto.EquipeId,
                Statut = string.IsNullOrWhiteSpace(dto.Statut) ? OrdreStatuts.Brouillon : dto.Statut,
                DateEmission = dto.DateEmission,
                DebutValidite = dto.DebutValidite,
                FinValidite = dto.FinValidite,
                Objet = dto.Objet,
                CreatedAt = DateTime.UtcNow
            };
            if (ordre.Statut is not (OrdreStatuts.Brouillon or OrdreStatuts.EnAttenteSignature))
                ordre.Statut = OrdreStatuts.Brouillon;
            _db.OrdresMission.Add(ordre);
            await _db.SaveChangesAsync();
            _users.AddJournal("Ordres de mission", "création", $"Ordre {ordre.Numero} créé");
        }
        return ApiResultDto.Ok("Ordre enregistré.");
    }

    public async Task<ApiResultDto> DemanderSignatureAsync(string id, string? userId)
    {
        var o = await _db.OrdresMission.FirstOrDefaultAsync(x => x.Id == id);
        if (o == null) return ApiResultDto.Fail("Ordre introuvable.");
        if (o.Statut != OrdreStatuts.Brouillon)
            return ApiResultDto.Fail("Seuls les ordres brouillon peuvent être soumis à signature.");
        o.Statut = OrdreStatuts.EnAttenteSignature;
        await _db.SaveChangesAsync();
        _users.AddJournal("Ordres de mission", "demande signature", $"Ordre {o.Numero} en attente de signature", userId);
        return ApiResultDto.Ok("Ordre soumis pour signature.");
    }

    public async Task<ApiResultDto> SignerAsync(string id, string? userId)
    {
        var o = await _db.OrdresMission.FirstOrDefaultAsync(x => x.Id == id);
        if (o == null) return ApiResultDto.Fail("Ordre introuvable.");
        if (o.Statut is not (OrdreStatuts.Brouillon or OrdreStatuts.EnAttenteSignature))
            return ApiResultDto.Fail("Seuls les ordres brouillon ou en attente de signature peuvent être signés.");
        o.Statut = OrdreStatuts.Signe;
        o.SigneLe = DateTime.UtcNow;
        o.SignePar = userId;
        await _db.SaveChangesAsync();
        _users.AddNotification("Ordre de mission signé", $"L'ordre {o.Numero} a été signé.");
        _users.AddJournal("Ordres de mission", "signature", $"Ordre {o.Numero} signé", userId);
        await _email.NotifyAsync(
            $"Ordre signé — {o.Numero}",
            $"<p>L'ordre de mission <strong>{o.Numero}</strong> a été signé.</p>",
            toRole: DataScope.RoleControleur);
        return ApiResultDto.Ok("Ordre signé.");
    }

    public async Task<ApiResultDto> PasserEnCoursAsync(string id, string? userId = null)
    {
        var o = await _db.OrdresMission.FirstOrDefaultAsync(x => x.Id == id);
        if (o == null) return ApiResultDto.Fail("Ordre introuvable.");
        if (o.Statut == OrdreStatuts.EnCours)
            return ApiResultDto.Ok("Ordre déjà en cours.");
        if (o.Statut != OrdreStatuts.Signe)
            return ApiResultDto.Fail("Seul un ordre signé peut passer en cours.");
        o.Statut = OrdreStatuts.EnCours;
        await _db.SaveChangesAsync();
        _users.AddJournal("Ordres de mission", "en cours", $"Ordre {o.Numero} passé en cours", userId);
        return ApiResultDto.Ok("Ordre passé en cours.");
    }

    public async Task<ApiResultDto> CloturerAsync(string id, string? userId = null)
    {
        var o = await _db.OrdresMission.FirstOrDefaultAsync(x => x.Id == id);
        if (o == null) return ApiResultDto.Fail("Ordre introuvable.");
        if (o.Statut == OrdreStatuts.Cloture)
            return ApiResultDto.Ok("Ordre déjà clôturé.");
        if (o.Statut is not (OrdreStatuts.EnCours or OrdreStatuts.Signe))
            return ApiResultDto.Fail("Seuls les ordres signés ou en cours peuvent être clôturés.");
        o.Statut = OrdreStatuts.Cloture;
        await _db.SaveChangesAsync();
        _users.AddJournal("Ordres de mission", "clôture", $"Ordre {o.Numero} clôturé", userId);
        return ApiResultDto.Ok("Ordre clôturé.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var o = await _db.OrdresMission.FirstOrDefaultAsync(x => x.Id == id);
        if (o != null)
        {
            if (o.Statut is not (OrdreStatuts.Brouillon or OrdreStatuts.EnAttenteSignature))
                return ApiResultDto.Fail("Seuls les ordres non signés peuvent être supprimés.");
            _db.OrdresMission.Remove(o);
            await _db.SaveChangesAsync();
            _users.AddJournal("Ordres de mission", "suppression", $"Ordre {id} supprimé");
        }
        return ApiResultDto.Ok("Ordre supprimé.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
