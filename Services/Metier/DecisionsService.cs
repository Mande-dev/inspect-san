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
    {
        var list = await _db.Decisions.AsNoTracking()
            .Include(d => d.Mission)
            .Include(d => d.Ecole)!.ThenInclude(e => e!.ChefEtablissement)
            .OrderByDescending(d => d.NumDecision)
            .ToListAsync();

        foreach (var d in list)
        {
            d.Id = d.NumDecision;
            d.FicheControleId = d.Mission?.Id ?? "";
            d.EcoleId = d.Ecole?.Id ?? "";
        }

        return list;
    }

    public async Task<IReadOnlyList<DecisionListDto>> ListAsync()
    {
        var decisions = await QueryEntitiesAsync();
        return decisions.Select(d => new DecisionListDto
        {
            Id = d.NumDecision,
            Numero = d.NumDecision,
            FicheControleId = d.Mission?.Id ?? "",
            FicheNumero = d.NumOrdre,
            EcoleId = d.Ecole?.Id ?? "",
            EcoleNom = d.Ecole?.Denomination,
            ChefNom = d.Ecole?.ChefEtablissement?.NomComplet,
            Type = DecisionTypes.LabelOf(d.DecisionFin),
            TypeDecision = d.DecisionFin
        }).ToList();
    }

    public async Task<List<FicheControle>> QueryFichesSansDecisionAsync()
    {
        var decided = await _db.Decisions.AsNoTracking().Select(d => d.NumOrdre).ToListAsync();
        var missions = await _db.Missions.AsNoTracking()
            .Include(m => m.Ecole)
            .Include(m => m.MissionProduits)
            .Include(m => m.MissionOutils)
            .Include(m => m.Photos)
            .Where(m => m.StatutFiche == FicheStatuts.Validee && !decided.Contains(m.NumOrdre))
            .ToListAsync();
        return missions.Select(m => FicheControle.FromMission(m, m.Ecole?.Id)).ToList();
    }

    public async Task<IReadOnlyList<FicheListDto>> FichesSansDecisionAsync()
    {
        var list = await QueryFichesSansDecisionAsync();
        var ecoleIds = list.Select(f => f.EcoleId).Distinct().ToList();
        var ecolesInfo = await _db.Ecoles.AsNoTracking()
            .Include(e => e.ChefEtablissement)
            .Where(e => ecoleIds.Contains(e.Id))
            .ToDictionaryAsync(e => e.Id, e => new
            {
                e.Denomination,
                ChefNom = e.ChefEtablissement != null ? e.ChefEtablissement.NomComplet : null
            });

        var produitCodes = list.SelectMany(f => f.ControleProduits.Select(cp => cp.ProduitCode)).Distinct().ToList();
        var outilCodes = list.SelectMany(f => f.ControleOutils.Select(co => co.OutilCode)).Distinct().ToList();
        var produitNoms = await _db.Produits.AsNoTracking()
            .Where(p => produitCodes.Contains(p.CodeProduit))
            .ToDictionaryAsync(p => p.CodeProduit, p => p.LibeleProduit);
        var outilNoms = await _db.Outils.AsNoTracking()
            .Where(o => outilCodes.Contains(o.CodeOutile))
            .ToDictionaryAsync(o => o.CodeOutile, o => o.LibelleOutile);

        return list.Select(f => new FicheListDto
        {
            Id = f.Id,
            Numero = f.Numero,
            MissionId = f.MissionId,
            EcoleId = f.EcoleId,
            EcoleNom = ecolesInfo.TryGetValue(f.EcoleId, out var eco) ? eco.Denomination : null,
            ChefNom = ecolesInfo.TryGetValue(f.EcoleId, out var eco2) ? eco2.ChefNom : null,
            Statut = f.Statut,
            EtatGeneral = f.EtatGeneral,
            NombreBatiments = f.NombreBatiments,
            NombreEleves = f.NombreEleves,
            ToilettesFilles = f.ToilettesFilles,
            ToilettesGarcons = f.ToilettesGarcons,
            ProduitsAutres = f.ProduitsAutres,
            ProduitsAutresQuantite = f.ProduitsAutresQuantite,
            OutilsAutres = f.OutilsAutres,
            OutilsAutresQuantite = f.OutilsAutresQuantite,
            Observations = f.Observations,
            RecommandationPreliminaire = f.RecommandationPreliminaire,
            ControleProduits = f.ControleProduits.Select(cp => new ControleProduitListDto
            {
                ProduitCode = cp.ProduitCode,
                ProduitNom = produitNoms.GetValueOrDefault(cp.ProduitCode),
                Quantite = cp.Quantite
            }).ToList(),
            ControleOutils = f.ControleOutils.Select(co => new ControleOutilListDto
            {
                OutilCode = co.OutilCode,
                OutilNom = outilNoms.GetValueOrDefault(co.OutilCode),
                Quantite = co.Quantite
            }).ToList(),
            Photos = f.Photos.Select(p => new FichePhotoListDto
            {
                Nom = p.Nom,
                Legende = p.Legende,
                Url = p.Url,
                NumOrdre = f.Numero,
                MissionId = f.MissionId
            }).ToList()
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(SaveDecisionDto dto, string? userId)
    {
        if (string.IsNullOrWhiteSpace(dto.FicheControleId) || string.IsNullOrWhiteSpace(dto.TypeDecision))
            return ApiResultDto.Fail("Fiche et type obligatoires.");

        if (!DecisionTypes.IsValid(dto.TypeDecision))
            return ApiResultDto.Fail("Type de décision invalide.");

        var typeCode = dto.TypeDecision.Trim();
        var isNew = string.IsNullOrEmpty(dto.Id);

        var mission = await _db.Missions.Include(m => m.Ecole).FirstOrDefaultAsync(m => m.Id == dto.FicheControleId);
        if (mission == null)
            return ApiResultDto.Fail("Fiche introuvable.");

        var ecoleId = mission.Ecole?.Id ?? dto.EcoleId;
        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsDecision(ecoleId))
            return ApiResultDto.Fail("Accès refusé pour cette décision / périmètre.");

        if (isNew)
        {
            if (mission.StatutFiche != FicheStatuts.Validee)
                return ApiResultDto.Fail("Une décision ne peut être prise que sur une fiche validée.");
            if (await _db.Decisions.AnyAsync(d => d.NumOrdre == mission.NumOrdre))
                return ApiResultDto.Fail("Cette fiche a déjà une décision.");
        }
        else
        {
            var existing = await _db.Decisions.FirstOrDefaultAsync(d => d.NumDecision == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Décision introuvable.");
            existing.DecisionFin = typeCode;
            await _db.SaveChangesAsync();
            _users.AddJournal("Décisions", "modification", $"Décision {existing.NumDecision} modifiée", userId);
            return ApiResultDto.Ok("Décision enregistrée.");
        }

        var count = await _db.Decisions.CountAsync();
        var numDecision = $"DEC/{DateTime.UtcNow:yyyy}/{count + 1:0000}";
        var decision = new Decision
        {
            NumDecision = numDecision,
            DecisionFin = typeCode,
            NumOrdre = mission.NumOrdre,
            NumAgrement = mission.NumAgrement
        };
        _db.Decisions.Add(decision);
        _users.AddJournal("Décisions", "création", $"Décision {decision.NumDecision} créée", userId);

        if (mission.Statut is MissionStatuts.EnCours or MissionStatuts.Signe)
        {
            mission.Validite = MissionStatuts.Cloture;
            _users.AddJournal("Missions", "clôture", $"Mission {mission.NumOrdre} clôturée (décision {decision.NumDecision})", userId);
        }

        await _db.SaveChangesAsync();

        var ecoleNom = mission.Ecole?.Denomination ?? ecoleId;
        var typeNom = DecisionTypes.LabelOf(typeCode);
        var chefUserId = await _db.Users.AsNoTracking()
            .Where(u => u.Role == "Chef d'établissement" && u.EcoleId == ecoleId)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();
        _users.AddNotification(
            "Décision sur votre établissement",
            $"Décision {decision.NumDecision} ({typeNom}) pour {ecoleNom}.",
            chefUserId);
        await _email.NotifyAsync(
            $"Décision — {decision.NumDecision}",
            $"<p>Décision <strong>{decision.NumDecision}</strong> ({typeNom}) pour {ecoleNom}.</p>",
            toUserId: chefUserId);

        return ApiResultDto.Ok("Décision enregistrée.");
    }

    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var d = await _db.Decisions.FirstOrDefaultAsync(x => x.NumDecision == id);
        if (d == null)
            return ApiResultDto.Ok("Décision supprimée.");

        _db.Decisions.Remove(d);
        await _db.SaveChangesAsync();
        _users.AddJournal("Décisions", "suppression", $"Décision {id} supprimée");
        return ApiResultDto.Ok("Décision supprimée.");
    }
}
