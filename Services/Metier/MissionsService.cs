using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Helpers;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>Gestion du cycle de vie des missions d'inspection.</summary>
public class MissionsService : IMissionsService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;
    private readonly IDomainEmailNotifier _email;
    private readonly ICurrentUserScope _scope;
    private readonly IMissionAccessService _access;

    /// <summary>Initialise le service missions avec ses dépendances.</summary>
    public MissionsService(
        InspectSanDbContext db,
        MockUserStore users,
        IDomainEmailNotifier? email = null,
        ICurrentUserScope? scope = null,
        IMissionAccessService? access = null)
    {
        _db = db;
        _users = users;
        _email = email ?? NullDomainEmailNotifier.Instance;
        _scope = scope ?? UnrestrictedUserScope.Instance;
        _access = access ?? new MissionAccessService(db);
    }

    /// <summary>Applique les filtres de recherche sur les missions.</summary>
    private static IQueryable<Mission> ApplyFilter(IQueryable<Mission> q, MissionFilterDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(m => m.NumOrdre.ToLower().Contains(term)
                             || m.NomEquipe.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.Statut))
            q = q.Where(m => m.Validite == filter.Statut);
        return q;
    }

    /// <summary>Retourne les entités mission correspondant au filtre.</summary>
    public async Task<List<Mission>> QueryEntitiesAsync(MissionFilterDto filter)
        => await ApplyFilter(_db.Missions.AsNoTracking().Include(m => m.Ecole), filter)
            .OrderByDescending(m => m.CreatedAt).ToListAsync();

    /// <summary>Liste les missions filtrées sous forme de DTO.</summary>
    public async Task<IReadOnlyList<MissionListDto>> ListAsync(MissionFilterDto filter)
    {
        var missions = await ApplyFilter(
                _db.Missions.AsNoTracking()
                    .Include(m => m.Ecole)
                    .Include(m => m.Affectations)
                        .ThenInclude(p => p.Agent),
                filter)
            .OrderByDescending(m => m.CreatedAt).ToListAsync();

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted)
        {
            missions = missions
                .Where(m => _access.CanReadFromAffectations(m.Affectations, scope.AgentId, false))
                .ToList();
        }
        return missions.Select(m => Map(m, scope)).ToList();
    }

    /// <summary>Crée ou met à jour une mission.</summary>
    public async Task<ApiResultDto> SaveAsync(SaveMissionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.EcoleId))
            return ApiResultDto.Fail("École obligatoire.");

        var ecole = await _db.Ecoles.AsNoTracking().FirstOrDefaultAsync(e => e.Id == dto.EcoleId);
        if (ecole == null)
            return ApiResultDto.Fail("École invalide.");

        var participations = dto.Participations ?? [];
        if (participations.Count == 0)
            return ApiResultDto.Fail("Au moins un participant est obligatoire.");

        var agentIds = participations.Select(p => p.AgentId).Distinct().ToList();
        var roleCodes = participations.Select(p => p.RoleMission).ToList();

        if (agentIds.Any(string.IsNullOrWhiteSpace) || roleCodes.Any(string.IsNullOrWhiteSpace))
            return ApiResultDto.Fail("Chaque participation doit avoir un agent et un rôle.");

        if (participations.GroupBy(p => p.AgentId).Any(g => g.Count() > 1))
            return ApiResultDto.Fail("Un agent ne peut apparaître qu'une fois par mission.");

        var agentsOk = await _db.Agents.AsNoTracking()
            .Where(a => agentIds.Contains(a.MatrAgent))
            .Select(a => a.MatrAgent)
            .ToListAsync();
        if (agentsOk.Count != agentIds.Count)
            return ApiResultDto.Fail("Un ou plusieurs agents sont invalides.");

        if (roleCodes.Any(c => !RolesMissionCodes.IsValid(c)))
            return ApiResultDto.Fail("Un ou plusieurs rôles de mission sont invalides.");

        var nbChef = participations.Count(p => p.RoleMission == RolesMissionCodes.ChefEquipe);
        if (nbChef == 0)
            return ApiResultDto.Fail("Au moins un participant doit avoir le rôle chef d'équipe.");
        if (nbChef > 1)
            return ApiResultDto.Fail("Une mission ne peut avoir qu'un seul chef d'équipe.");

        var nbAdjoint = participations.Count(p => p.RoleMission == RolesMissionCodes.ChefAdjoint);
        if (nbAdjoint > 1)
            return ApiResultDto.Fail("Une mission ne peut avoir qu'un seul chef adjoint.");

        var scope = await _scope.GetAsync();
        if (!scope.Unrestricted && !scope.AllowsMission(agentIds, dto.EcoleId))
            return ApiResultDto.Fail("Accès refusé pour cette mission / périmètre.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Missions
                .Include(m => m.Affectations)
                .FirstOrDefaultAsync(m => m.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Mission introuvable.");
            if (existing.Statut is MissionStatuts.Cloture)
                return ApiResultDto.Fail("Mission clôturée : modification impossible.");

            if (!_access.CanWriteFromAffectations(existing.Affectations, scope.AgentId, scope.Unrestricted)
                && !scope.Unrestricted)
                return ApiResultDto.Fail("Vous n'avez pas le droit de modifier cette mission.");

            // Préserver les délégations pour les mêmes adjoints
            var prevDeleg = existing.Affectations
                .Where(a => a.Fonction == RolesMissionCodes.ChefAdjoint && a.EcritureDeleguee)
                .Select(a => a.MatrAgent)
                .ToHashSet(StringComparer.Ordinal);

            existing.NumAgrement = ecole.NumAgrement;
            existing.NomEquipe = NomEquipeFromNumero(existing.NumOrdre);
            if (!string.IsNullOrWhiteSpace(dto.Statut)
                && existing.Statut == MissionStatuts.Brouillon
                && dto.Statut is MissionStatuts.Brouillon or MissionStatuts.EnAttenteSignature)
                existing.Validite = dto.Statut;
            existing.DateDebut = dto.DateEmission;
            existing.DateFin = dto.FinValidite;
            // MontPer est saisi uniquement via la fiche de contrôle — ne pas écraser ici.
            if (dto.Objet != null)
                existing.Objet = string.IsNullOrWhiteSpace(dto.Objet) ? null : dto.Objet.Trim();

            _db.Affectations.RemoveRange(existing.Affectations);
            existing.Affectations = participations.Select(p => new Affectation
            {
                NomOrdre = existing.NumOrdre,
                MatrAgent = p.AgentId,
                Fonction = p.RoleMission.Trim(),
                EcritureDeleguee = p.RoleMission == RolesMissionCodes.ChefAdjoint
                                   && prevDeleg.Contains(p.AgentId)
            }).ToList();

            await _db.SaveChangesAsync();
            _users.AddJournal("Missions", "modification", $"Mission {existing.NumOrdre} modifiée");
        }
        else
        {
            if (!scope.Unrestricted)
                return ApiResultDto.Fail("Seuls les administrateurs et le Directeur Provincial peuvent créer une mission.");

            var numero = await NumeroGenerator.NextMissionAsync(_db);
            var mission = new Mission
            {
                Id = NewId("mis"),
                NumOrdre = numero,
                NumAgrement = ecole.NumAgrement,
                NomEquipe = NomEquipeFromNumero(numero),
                Validite = string.IsNullOrWhiteSpace(dto.Statut) ? MissionStatuts.Brouillon : dto.Statut,
                DateDebut = dto.DateEmission,
                DateFin = dto.FinValidite,
                MontPer = null,
                Objet = string.IsNullOrWhiteSpace(dto.Objet) ? null : dto.Objet.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            if (mission.Statut is not (MissionStatuts.Brouillon or MissionStatuts.EnAttenteSignature))
                mission.Validite = MissionStatuts.Brouillon;

            mission.Affectations = participations.Select(p => new Affectation
            {
                NomOrdre = mission.NumOrdre,
                MatrAgent = p.AgentId,
                Fonction = p.RoleMission.Trim(),
                EcritureDeleguee = false
            }).ToList();

            _db.Missions.Add(mission);
            await _db.SaveChangesAsync();
            _users.AddJournal("Missions", "création", $"Mission {mission.NumOrdre} créée");
        }
        return ApiResultDto.Ok("Mission enregistrée.");
    }

    /// <summary>Délègue l'écriture au chef adjoint de la mission.</summary>
    public async Task<ApiResultDto> DeleguerEcritureAdjointAsync(string missionId, string? userId)
    {
        var m = await _db.Missions.Include(x => x.Affectations).ThenInclude(a => a.Agent)
            .FirstOrDefaultAsync(x => x.Id == missionId);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");

        var scope = await _scope.GetAsync();
        if (!IsChefEquipeAffecte(m.Affectations, scope.AgentId))
            return ApiResultDto.Fail("Seul le chef d'équipe peut céder l'écriture.");

        var adjoint = m.Affectations.FirstOrDefault(a => a.Fonction == RolesMissionCodes.ChefAdjoint);
        if (adjoint == null)
            return ApiResultDto.Fail("Aucun chef adjoint sur cette mission.");
        if (adjoint.EcritureDeleguee)
            return ApiResultDto.Ok("L'écriture est déjà déléguée à l'adjoint.");

        adjoint.EcritureDeleguee = true;
        await _db.SaveChangesAsync();
        var nom = adjoint.Agent?.NomAgent ?? adjoint.MatrAgent;
        _users.AddJournal(
            "Missions",
            "délégation écriture",
            $"Mission {m.NumOrdre} — écriture cédée à l'adjoint {nom} ({adjoint.MatrAgent})",
            userId);
        return ApiResultDto.Ok("Droits d'écriture cédés au chef adjoint.");
    }

    /// <summary>Retire la délégation d'écriture du chef adjoint.</summary>
    public async Task<ApiResultDto> RetirerDelegationAdjointAsync(string missionId, string? userId)
    {
        var m = await _db.Missions.Include(x => x.Affectations).ThenInclude(a => a.Agent)
            .FirstOrDefaultAsync(x => x.Id == missionId);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");

        var scope = await _scope.GetAsync();
        if (!IsChefEquipeAffecte(m.Affectations, scope.AgentId))
            return ApiResultDto.Fail("Seul le chef d'équipe peut retirer la délégation.");

        var adjoint = m.Affectations.FirstOrDefault(a => a.Fonction == RolesMissionCodes.ChefAdjoint);
        if (adjoint == null)
            return ApiResultDto.Fail("Aucun chef adjoint sur cette mission.");
        if (!adjoint.EcritureDeleguee)
            return ApiResultDto.Ok("Aucune délégation active.");

        adjoint.EcritureDeleguee = false;
        await _db.SaveChangesAsync();
        var nom = adjoint.Agent?.NomAgent ?? adjoint.MatrAgent;
        _users.AddJournal(
            "Missions",
            "retrait délégation",
            $"Mission {m.NumOrdre} — écriture retirée à l'adjoint {nom} ({adjoint.MatrAgent})",
            userId);
        return ApiResultDto.Ok("Délégation d'écriture retirée.");
    }

    /// <summary>Passe la mission de brouillon à en attente de signature.</summary>
    public async Task<ApiResultDto> DemanderSignatureAsync(string id, string? userId)
    {
        var m = await _db.Missions.Include(x => x.Affectations).FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");
        var scope = await _scope.GetAsync();
        if (!_access.CanWriteFromAffectations(m.Affectations, scope.AgentId, scope.Unrestricted))
            return ApiResultDto.Fail("Accès refusé.");
        if (m.Statut != MissionStatuts.Brouillon)
            return ApiResultDto.Fail("Seules les missions brouillon peuvent être soumises à signature.");
        m.Validite = MissionStatuts.EnAttenteSignature;
        await _db.SaveChangesAsync();
        _users.AddJournal("Missions", "demande signature", $"Mission {m.NumOrdre} en attente de signature", userId);
        return ApiResultDto.Ok("Mission soumise pour signature.");
    }

    /// <summary>Signe une mission brouillon ou en attente de signature.</summary>
    public async Task<ApiResultDto> SignerAsync(string id, string? userId)
    {
        var m = await _db.Missions.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");
        if (m.Statut is not (MissionStatuts.Brouillon or MissionStatuts.EnAttenteSignature))
            return ApiResultDto.Fail("Seules les missions brouillon ou en attente de signature peuvent être signées.");
        m.Validite = MissionStatuts.Signe;
        m.SigneLe = DateTime.UtcNow;
        m.SignePar = userId;
        await _db.SaveChangesAsync();
        _users.AddNotification("Mission signée", $"La mission {m.NumOrdre} a été signée.");
        _users.AddJournal("Missions", "signature", $"Mission {m.NumOrdre} signée", userId);
        await _email.NotifyAsync(
            $"Mission signée — {m.NumOrdre}",
            $"<p>La mission <strong>{m.NumOrdre}</strong> a été signée.</p>",
            toRole: DataScope.RoleControleur);
        return ApiResultDto.Ok("Mission signée.");
    }

    /// <summary>Passe une mission signée au statut en cours.</summary>
    public async Task<ApiResultDto> PasserEnCoursAsync(string id, string? userId = null)
    {
        var m = await _db.Missions.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");
        if (m.Statut == MissionStatuts.EnCours)
            return ApiResultDto.Ok("Mission déjà en cours.");
        if (m.Statut != MissionStatuts.Signe)
            return ApiResultDto.Fail("Seule une mission signée peut passer en cours.");
        m.Validite = MissionStatuts.EnCours;
        await _db.SaveChangesAsync();
        _users.AddJournal("Missions", "en cours", $"Mission {m.NumOrdre} passée en cours", userId);
        return ApiResultDto.Ok("Mission passée en cours.");
    }

    /// <summary>Clôture une mission signée ou en cours.</summary>
    public async Task<ApiResultDto> CloturerAsync(string id, string? userId = null)
    {
        var m = await _db.Missions.FirstOrDefaultAsync(x => x.Id == id);
        if (m == null) return ApiResultDto.Fail("Mission introuvable.");
        if (m.Statut == MissionStatuts.Cloture)
            return ApiResultDto.Ok("Mission déjà clôturée.");
        if (m.Statut is not (MissionStatuts.EnCours or MissionStatuts.Signe))
            return ApiResultDto.Fail("Seules les missions signées ou en cours peuvent être clôturées.");
        m.Validite = MissionStatuts.Cloture;
        await _db.SaveChangesAsync();
        _users.AddJournal("Missions", "clôture", $"Mission {m.NumOrdre} clôturée", userId);
        return ApiResultDto.Ok("Mission clôturée.");
    }

    /// <summary>Supprime une mission si le statut et les droits le permettent.</summary>
    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var m = await _db.Missions
            .Include(x => x.Affectations)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (m != null)
        {
            var scope = await _scope.GetAsync();
            if (!_access.CanWriteFromAffectations(m.Affectations, scope.AgentId, scope.Unrestricted)
                && !scope.Unrestricted)
                return ApiResultDto.FailBlocked(
                    "Suppression non autorisée",
                    "Vous ne pouvez pas supprimer cette mission.",
                    "Seuls les responsables habilités de la mission (ou l'administration) peuvent retirer un ordre de mission du dossier.");

            if (m.Statut is not (MissionStatuts.Brouillon or MissionStatuts.EnAttenteSignature))
                return ApiResultDto.FailBlocked(
                    "Suppression non autorisée",
                    "Cette mission ne peut plus être retirée.",
                    "L'ordre de mission a déjà été signé ou est en cours d'exécution.\n\n" +
                    "Seules les missions encore à l'état de brouillon ou en attente de signature peuvent être annulées.");

            if (m.StatutFiche != null)
                return ApiResultDto.FailBlocked(
                    "Suppression non autorisée",
                    "Cette mission ne peut plus être retirée.",
                    "Une fiche de contrôle a déjà été établie pour cette mission.\n\n" +
                    "Le dossier d'inspection doit être conservé ; la suppression de la mission n'est plus possible.");
            _db.Affectations.RemoveRange(m.Affectations);
            _db.Missions.Remove(m);
            await _db.SaveChangesAsync();
            _users.AddJournal("Missions", "suppression", $"Mission {id} supprimée");
        }
        return ApiResultDto.Ok("Mission supprimée.");
    }

    /// <summary>Mappe une mission vers son DTO de liste selon le périmètre.</summary>
    private MissionListDto Map(Mission m, UserDataScope scope)
    {
        var canWrite = _access.CanWriteFromAffectations(m.Affectations, scope.AgentId, scope.Unrestricted);
        var isChefEquipe = IsChefEquipeAffecte(m.Affectations, scope.AgentId);
        return new MissionListDto
        {
            Id = m.Id,
            Numero = m.NumOrdre,
            EcoleId = m.Ecole?.Id ?? "",
            EcoleNom = m.Ecole?.Denomination,
            NomEquipe = m.NomEquipe,
            Statut = m.Statut,
            DateEmission = m.DateDebut,
            FinValidite = m.DateFin,
            SigneLe = m.SigneLe,
            Objet = m.Objet,
            MontPer = m.MontPer,
            CanWrite = canWrite,
            CanDeleguer = isChefEquipe && m.Affectations.Any(a => a.Fonction == RolesMissionCodes.ChefAdjoint),
            Participations = m.Affectations.Select(p => new ParticipationListDto
            {
                Id = p.IdAffectation.ToString(),
                AgentId = p.MatrAgent,
                AgentNom = p.Agent?.NomAgent,
                AgentTelephone = p.Agent?.TelAgent,
                RoleMission = p.Fonction,
                RoleNom = RolesMissionCodes.LabelOf(p.Fonction),
                EcritureDeleguee = p.EcritureDeleguee
            }).ToList()
        };
    }

    /// <summary>Indique si l'agent est chef d'équipe dans les affectations.</summary>
    private static bool IsChefEquipeAffecte(IEnumerable<Affectation> affectations, string? agentId)
        => !string.IsNullOrWhiteSpace(agentId)
           && affectations.Any(a =>
               a.Fonction == RolesMissionCodes.ChefEquipe
               && string.Equals(a.MatrAgent, agentId, StringComparison.Ordinal));

    /// <summary>Dérive un nom d'équipe à partir du numéro de mission.</summary>
    internal static string NomEquipeFromNumero(string numero)
        => $"Equipe-{numero}";

    /// <summary>Génère un nouvel identifiant préfixé.</summary>
    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
