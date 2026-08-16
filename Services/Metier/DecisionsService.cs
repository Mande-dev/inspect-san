using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class DecisionsService : IDecisionsService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IDomainEmailNotifier _email;
    private readonly ICurrentUserScope _scope;

    public DecisionsService(
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

    public async Task<List<Decision>> QueryEntitiesAsync()
        => await _db.Decisions.AsNoTracking()
            .Include(d => d.TypeDecision)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();

    public async Task<IReadOnlyList<DecisionListDto>> ListAsync()
    {
        var decisions = await _db.Decisions.AsNoTracking()
            .Include(d => d.TypeDecision)
            .Include(d => d.Ecole)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
        return decisions.Select(d => new DecisionListDto
        {
            Id = d.Id,
            Numero = d.Numero,
            RapportId = d.RapportId,
            EcoleId = d.EcoleId,
            EcoleNom = d.Ecole?.Denomination,
            Type = d.TypeDecision?.Nom ?? d.TypeDecision?.Code ?? "",
            TypeDecisionId = d.TypeDecisionId,
            DelaiExecution = d.DelaiExecution,
            StatutExecution = d.StatutExecution,
            Commentaire = d.Commentaire ?? d.Motif
        }).ToList();
    }

    public async Task<List<Rapport>> QueryRapportsSansDecisionAsync()
    {
        var decided = await _db.Decisions.AsNoTracking().Select(d => d.RapportId).ToListAsync();
        return await _db.Rapports.AsNoTracking()
            .Where(r => r.Statut == RapportStatuts.Transmis && !decided.Contains(r.Id))
            .ToListAsync();
    }

    public async Task<IReadOnlyList<RapportListDto>> RapportsSansDecisionAsync()
    {
        var list = await QueryRapportsSansDecisionAsync();
        var ecoleIds = list.Select(r => r.EcoleId).Distinct().ToList();
        var noms = await _db.Ecoles.AsNoTracking()
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => e.Denomination);
        return list.Select(r => new RapportListDto
        {
            Id = r.Id,
            Numero = r.Numero,
            EcoleId = r.EcoleId,
            EcoleNom = noms.GetValueOrDefault(r.EcoleId),
            FicheIds = r.FicheIds.ToList(),
            Synthese = r.Synthese,
            Statut = r.Statut
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(SaveDecisionDto dto, string? userId)
    {
        if (string.IsNullOrWhiteSpace(dto.RapportId) || string.IsNullOrWhiteSpace(dto.TypeDecisionId))
            return ApiResultDto.Fail("Rapport et type obligatoires.");

        var typeDecision = await _db.TypesDecision.FirstOrDefaultAsync(t => t.Id == dto.TypeDecisionId);
        if (typeDecision == null)
            return ApiResultDto.Fail("Type de décision invalide.");

        var isNew = string.IsNullOrEmpty(dto.Id);
        Decision? existing = null;
        if (!isNew)
        {
            existing = await _db.Decisions.FirstOrDefaultAsync(d => d.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Décision introuvable.");
            dto.RapportId = existing.RapportId;
        }

        var rapport = await _db.Rapports.FirstOrDefaultAsync(r => r.Id == dto.RapportId);
        if (rapport == null)
            return ApiResultDto.Fail("Rapport introuvable.");

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsDecision(rapport.EcoleId))
            return ApiResultDto.Fail("Accès refusé pour cette décision / périmètre.");

        if (isNew)
        {
            if (rapport.Statut != RapportStatuts.Transmis)
                return ApiResultDto.Fail("Une décision ne peut être prise que sur un rapport transmis au Directeur Provincial.");
            var deja = await _db.Decisions.AnyAsync(d => d.RapportId == rapport.Id);
            if (deja)
                return ApiResultDto.Fail("Ce rapport a déjà une décision. Un rapport ne peut recevoir qu’une seule décision.");
        }
        else if (rapport.Statut is not (RapportStatuts.Transmis or RapportStatuts.Traite))
        {
            return ApiResultDto.Fail("Cette décision ne peut plus être modifiée pour ce statut de rapport.");
        }

        var commentaire = dto.Commentaire;
        if (string.IsNullOrEmpty(commentaire) && !string.IsNullOrEmpty(dto.Motif))
            commentaire = dto.Motif;

        var typeToStatut = new Dictionary<string, string>
        {
            [DecisionTypes.Maintien] = EcoleStatuts.Active,
            [DecisionTypes.Avertissement] = EcoleStatuts.Active,
            [DecisionTypes.Rehabilitation] = EcoleStatuts.Rehabilitation,
            [DecisionTypes.FermetureTemporaire] = EcoleStatuts.FermetureTemporaire,
            [DecisionTypes.FermetureDefinitive] = EcoleStatuts.FermetureDefinitive
        };

        Decision decision;
        var ecoleId = rapport.EcoleId;
        if (!isNew)
        {
            existing!.TypeDecisionId = dto.TypeDecisionId;
            existing.EcoleId = ecoleId;
            existing.DelaiExecution = dto.DelaiExecution;
            existing.StatutExecution = string.IsNullOrEmpty(dto.StatutExecution) ? existing.StatutExecution : dto.StatutExecution;
            existing.Motif = dto.Motif;
            existing.Commentaire = commentaire;
            decision = existing;
            _users.AddJournal("Décisions", "modification", $"Décision {existing.Numero} modifiée", userId);
        }
        else
        {
            var count = await _db.Decisions.CountAsync();
            decision = new Decision
            {
                Id = NewId("dec"),
                Numero = $"DEC/{DateTime.UtcNow:yyyy}/{count + 1:0000}",
                RapportId = rapport.Id,
                EcoleId = ecoleId,
                TypeDecisionId = dto.TypeDecisionId,
                DelaiExecution = dto.DelaiExecution,
                StatutExecution = string.IsNullOrEmpty(dto.StatutExecution) ? StatutsExecution.EnAttente : dto.StatutExecution,
                Motif = dto.Motif,
                Commentaire = commentaire,
                DecidePar = userId,
                DecideLe = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
            _db.Decisions.Add(decision);
            _users.AddJournal("Décisions", "création", $"Décision {decision.Numero} créée", userId);
        }

        var code = typeDecision.Code ?? "";
        var ecole = await _db.Ecoles.FirstOrDefaultAsync(e => e.Id == ecoleId);
        if (ecole != null && typeToStatut.TryGetValue(code, out var st))
        {
            ecole.Statut = st;
            ecole.UpdatedAt = DateTime.UtcNow;
        }

        rapport.Statut = RapportStatuts.Traite;

        // Règle clôture : décision prise → clôturer les OM en_cours/signé liés aux fiches du rapport
        if (isNew && rapport.FicheIds.Count > 0)
        {
            var omIds = await _db.FichesControle.AsNoTracking()
                .Where(f => rapport.FicheIds.Contains(f.Id))
                .Select(f => f.OrdreMissionId)
                .Distinct()
                .ToListAsync();
            var oms = await _db.OrdresMission
                .Where(o => omIds.Contains(o.Id) && (o.Statut == OrdreStatuts.EnCours || o.Statut == OrdreStatuts.Signe))
                .ToListAsync();
            foreach (var om in oms)
            {
                om.Statut = OrdreStatuts.Cloture;
                _users.AddJournal("Ordres de mission", "clôture", $"Ordre {om.Numero} clôturé (décision {decision.Numero})", userId);
            }
        }

        await _db.SaveChangesAsync();

        if (isNew)
        {
            var ecoleNom = ecole?.Denomination ?? ecoleId;
            var typeNom = typeDecision.Nom ?? typeDecision.Code ?? "mesure";
            var chefUserId = await _db.Users.AsNoTracking()
                .Where(u => u.Role == "Chef d'établissement" && u.EcoleId == ecoleId)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();
            _users.AddNotification(
                "Décision sur votre établissement",
                $"Décision {decision.Numero} ({typeNom}) pour {ecoleNom}. Suivi d’exécution : {decision.StatutExecution}.",
                chefUserId);
            await _email.NotifyAsync(
                $"Décision — {decision.Numero}",
                $"<p>Décision <strong>{decision.Numero}</strong> ({typeNom}) pour {ecoleNom}.</p>",
                toUserId: chefUserId);
        }

        return ApiResultDto.Ok("Décision enregistrée. Statut école synchronisé.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var d = await _db.Decisions.FirstOrDefaultAsync(x => x.Id == id);
        if (d == null)
            return ApiResultDto.Ok("Décision supprimée.");

        var rapportId = d.RapportId;
        _db.Decisions.Remove(d);
        await _db.SaveChangesAsync();

        var encore = await _db.Decisions.AnyAsync(x => x.RapportId == rapportId);
        if (!encore)
        {
            var rapport = await _db.Rapports.FirstOrDefaultAsync(r => r.Id == rapportId);
            if (rapport != null)
                rapport.Statut = RapportStatuts.Transmis;
            await _db.SaveChangesAsync();
        }

        _users.AddJournal("Décisions", "suppression", $"Décision {id} supprimée");
        // Statut école : on conserve le dernier statut appliqué (pas de rollback).
        return ApiResultDto.Ok("Décision supprimée. Le rapport est de nouveau en attente de décision.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
