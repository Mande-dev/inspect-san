using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class AccusesService : IAccusesService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IDomainEmailNotifier _email;

    public AccusesService(InspectSanDbContext db, MockUserStore users, IDomainEmailNotifier? email = null)
    {
        _db = db;
        _users = users;
        _email = email ?? NullDomainEmailNotifier.Instance;
    }

    public async Task<List<Rapport>> QueryEntitiesAsync()
        => await _db.Rapports.AsNoTracking()
            .Where(r => r.Statut == RapportStatuts.Depose
                     || r.Statut == RapportStatuts.Accuse
                     || r.Statut == RapportStatuts.Transmis)
            .ToListAsync();

    public async Task<IReadOnlyList<AccuseListDto>> ListAsync(AccuseFilterDto filter)
    {
        var q = _db.Rapports.AsNoTracking()
            .Where(r => r.Statut == RapportStatuts.Depose
                     || r.Statut == RapportStatuts.Accuse
                     || r.Statut == RapportStatuts.Transmis);

        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(r => r.Statut == filter.Statut);

        var list = await q.ToListAsync();
        var ecoleIds = list.Select(r => r.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);

        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim();
            list = list.Where(r =>
                r.Numero.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                (noms.GetValueOrDefault(r.EcoleId) ?? "").Contains(term, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return list.Select(r => new AccuseListDto
        {
            Id = r.Id,
            Numero = r.Numero,
            EcoleId = r.EcoleId,
            EcoleNom = noms.GetValueOrDefault(r.EcoleId),
            Statut = r.Statut,
            DeposeLe = r.DeposeLe,
            AccuseReceptionLe = r.AccuseReceptionLe
        }).ToList();
    }

    public async Task<ApiResultDto> AccuserAsync(string id, string? userId)
    {
        var r = await _db.Rapports.FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) return ApiResultDto.Fail("Rapport introuvable.");
        if (r.Statut != RapportStatuts.Depose)
            return ApiResultDto.Fail("Seuls les rapports déposés peuvent être accusés.");
        r.Statut = RapportStatuts.Accuse;
        r.AccuseReceptionLe = DateTime.UtcNow;
        r.AccusePar = userId;
        await _db.SaveChangesAsync();
        _users.AddJournal("Rapports", "accusé", $"Accusé délivré pour {r.Numero}", userId);
        await _email.NotifyAsync(
            $"Accusé de réception — {r.Numero}",
            $"<p>Accusé de réception délivré pour le rapport <strong>{r.Numero}</strong>.</p>",
            toRole: DataScope.RoleControleur);
        return ApiResultDto.Ok("Accusé de réception délivré.");
    }

    public async Task<ApiResultDto> TransmettreAsync(string id)
    {
        var r = await _db.Rapports.FirstOrDefaultAsync(x => x.Id == id);
        if (r == null) return ApiResultDto.Fail("Rapport introuvable.");
        if (r.Statut != RapportStatuts.Accuse)
            return ApiResultDto.Fail("Le rapport doit d’abord être accusé de réception avant transmission au DP.");
        r.Statut = RapportStatuts.Transmis;
        r.TransmisLe = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        _users.AddNotification("Rapport transmis", $"Le rapport {r.Numero} a été transmis au Directeur Provincial.");
        _users.AddJournal("Rapports", "transmission", $"Rapport {r.Numero} transmis");
        await _email.NotifyAsync(
            $"Rapport transmis — {r.Numero}",
            $"<p>Le rapport <strong>{r.Numero}</strong> a été transmis au Directeur Provincial.</p>",
            toRole: DataScope.RoleDp);
        return ApiResultDto.Ok("Rapport transmis au Directeur Provincial.");
    }
}
