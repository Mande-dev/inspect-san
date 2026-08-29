using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class DashboardService : IDashboardService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public DashboardService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    public async Task<DashboardDto> GetDashboardAsync(
        string role, string? userId, string? userEcoleId = null, string? userAgentId = null)
    {
        var scope = DataScope.Resolve(role, userId, userEcoleId, userAgentId);
        var ecoles = await _db.Ecoles.AsNoTracking().ToListAsync();
        var missions = await _db.Missions.AsNoTracking()
            .Include(m => m.Affectations)
            .Include(m => m.Ecole)
            .ToListAsync();
        var fiches = missions.Where(m => m.StatutFiche != null).ToList();
        var decisions = await _db.Decisions.AsNoTracking().Include(d => d.Ecole).ToListAsync();

        if (!scope.Unrestricted)
        {
            if (!string.IsNullOrEmpty(scope.AgentId))
            {
                var agentId = scope.AgentId;
                missions = missions
                    .Where(m => m.Affectations.Any(p => p.MatrAgent == agentId))
                    .ToList();
                var missionIds = missions.Select(m => m.Id).ToHashSet();
                fiches = fiches.Where(f => missionIds.Contains(f.Id)).ToList();
                ecoles = ecoles.Where(e => missions.Any(m => m.Ecole?.Id == e.Id)).ToList();
                decisions = decisions.Where(d => ecoles.Any(e => e.NumAgrement == d.NumAgrement)).ToList();
            }
            else if (!string.IsNullOrEmpty(scope.EcoleId))
            {
                var ecoleId = scope.EcoleId;
                ecoles = ecoles.Where(e => e.Id == ecoleId).ToList();
                var numAg = ecoles.Select(e => e.NumAgrement).ToHashSet();
                missions = missions.Where(m => numAg.Contains(m.NumAgrement)).ToList();
                fiches = fiches.Where(f => numAg.Contains(f.NumAgrement)).ToList();
                decisions = decisions.Where(d => numAg.Contains(d.NumAgrement)).ToList();
            }
            else
            {
                ecoles = [];
                missions = [];
                fiches = [];
                decisions = [];
            }
        }

        var decidedOrdres = decisions.Select(d => d.NumOrdre).ToHashSet();
        var sansDecision = fiches.Count(f =>
            f.StatutFiche == FicheStatuts.Validee && !decidedOrdres.Contains(f.NumOrdre));
        var mois = new[] { "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc." };
        var now = DateTime.UtcNow;

        return new DashboardDto
        {
            Role = role,
            RoleTip = role switch
            {
                "Administrateur système" => "Vous disposez d'une vue complète sur toutes les écoles, missions, fiches et décisions.",
                "Directeur Provincial" => "Consultez les fiches validées et statuez sur les décisions en attente.",
                "Contrôleur" => "Ce tableau de bord affiche les missions auxquelles vous participez et les fiches associées.",
                "Agent du Secrétariat" => "Suivez les missions, fiches et décisions du périmètre provincial.",
                _ => ""
            },
            EcolesCount = ecoles.Count,
            MissionsEnCours = missions.Count(m => m.Statut == MissionStatuts.EnCours),
            FichesEnAttente = fiches.Count(f => f.StatutFiche == FicheStatuts.EnAttenteValidation),
            DecisionsEnAttente = sansDecision,
            EcolesByRegime = ecoles
                .GroupBy(e => RegGes.LabelOf(e.RegGes))
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            DecisionsByType = decisions
                .GroupBy(d => DecisionTypes.LabelOf(d.DecisionFin) is { Length: > 0 } l ? l : "(sans type)")
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            ControlesParMois = Enumerable.Range(0, 6).Select(i =>
            {
                var d = new DateTime(now.Year, now.Month, 1).AddMonths(-5 + i);
                return new ChartPointDto
                {
                    Label = mois[d.Month - 1],
                    Value = fiches.Count(f => f.CreatedAt.Year == d.Year && f.CreatedAt.Month == d.Month)
                };
            }).ToList(),
            RecentJournal = FilterJournal(role, userEcoleId)
                .OrderByDescending(j => j.CreatedAt)
                .Take(8)
                .Select(j => new JournalListDto
                {
                    Id = j.Id,
                    UtilisateurId = j.UtilisateurId,
                    Module = j.Module,
                    Action = j.Action,
                    Detail = j.Detail,
                    CreatedAt = j.CreatedAt
                }).ToList()
        };
    }

    private IEnumerable<Models.Entities.JournalEntry> FilterJournal(string role, string? _)
    {
        var all = _users.JournalActivite.AsEnumerable();
        return role switch
        {
            DataScope.RoleAdmin or DataScope.RoleDp or DataScope.RoleSecretariat => all,
            DataScope.RoleControleur => all.Where(j =>
                j.Module is "Missions" or "Fiches" or "Ordres de mission"),
            // Ancien rôle login chef : plus de périmètre journal
            DataScope.RoleChef => Enumerable.Empty<Models.Entities.JournalEntry>(),
            _ => Enumerable.Empty<Models.Entities.JournalEntry>()
        };
    }
}
