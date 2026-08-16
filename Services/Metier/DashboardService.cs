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
        string role, string? userId, string? userEcoleId = null, string? userEquipeId = null)
    {
        var scope = DataScope.Resolve(role, userId, userEcoleId, userEquipeId);
        var ecoles = await _db.Ecoles.AsNoTracking().Include(e => e.Regime).ToListAsync();
        var ordres = await _db.OrdresMission.AsNoTracking().ToListAsync();
        var fiches = await _db.FichesControle.AsNoTracking().ToListAsync();
        var rapports = await _db.Rapports.AsNoTracking().ToListAsync();
        var decisions = await _db.Decisions.AsNoTracking().Include(d => d.TypeDecision).ToListAsync();

        if (!scope.Unrestricted)
        {
            if (!string.IsNullOrEmpty(scope.EquipeId))
            {
                ordres = ordres.Where(o => o.EquipeId == scope.EquipeId).ToList();
                var ordreIds = ordres.Select(o => o.Id).ToHashSet();
                fiches = fiches.Where(f => ordreIds.Contains(f.OrdreMissionId)).ToList();
                var ficheIds = fiches.Select(f => f.Id).ToHashSet();
                rapports = rapports.Where(r =>
                    r.FicheIds.Any(id => ficheIds.Contains(id)) ||
                    ordres.Any(o => o.EcoleId == r.EcoleId)).ToList();
                ecoles = ecoles.Where(e => ordres.Any(o => o.EcoleId == e.Id)).ToList();
                decisions = decisions.Where(d => ecoles.Any(e => e.Id == d.EcoleId)).ToList();
            }
            else if (!string.IsNullOrEmpty(scope.EcoleId))
            {
                var ecoleId = scope.EcoleId;
                ecoles = ecoles.Where(e => e.Id == ecoleId).ToList();
                ordres = ordres.Where(o => o.EcoleId == ecoleId).ToList();
                fiches = fiches.Where(f => f.EcoleId == ecoleId).ToList();
                rapports = rapports.Where(r => r.EcoleId == ecoleId).ToList();
                decisions = decisions.Where(d => d.EcoleId == ecoleId).ToList();
            }
            else
            {
                ecoles = [];
                ordres = [];
                fiches = [];
                rapports = [];
                decisions = [];
            }
        }

        var sansDecision = rapports.Count(r =>
            r.Statut == RapportStatuts.Transmis && !decisions.Any(d => d.RapportId == r.Id));
        var mois = new[] { "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc." };
        var now = DateTime.UtcNow;

        // KPI : missions = uniquement en_cours ; fiches en attente = uniquement en_attente_validation (chef).
        return new DashboardDto
        {
            Role = role,
            RoleTip = role switch
            {
                "Administrateur système" => "Vous disposez d'une vue complète sur toutes les écoles, missions, rapports et décisions.",
                "Directeur Provincial" => "Consultez les rapports transmis et statuez sur les décisions en attente.",
                "Contrôleur" => "Ce tableau de bord affiche les ordres de mission de votre équipe et les fiches associées.",
                "Agent du Secrétariat" => "Suivez les rapports déposés à accuser, puis à transmettre au Directeur Provincial.",
                "Chef d'établissement" => "Vous visualisez les fiches et décisions concernant votre établissement.",
                _ => ""
            },
            EcolesCount = ecoles.Count,
            MissionsEnCours = ordres.Count(o => o.Statut == OrdreStatuts.EnCours),
            FichesEnAttente = fiches.Count(f => f.Statut == FicheStatuts.EnAttenteValidation),
            RapportsDeposes = rapports.Count(r => r.Statut == RapportStatuts.Depose),
            DecisionsEnAttente = sansDecision + decisions.Count(d => d.StatutExecution == StatutsExecution.EnCours),
            EcolesByRegime = ecoles
                .GroupBy(e => e.Regime?.Nom ?? "(sans régime)")
                .Select(g => new ChartPointDto { Label = g.Key, Value = g.Count() }).ToList(),
            DecisionsByType = decisions
                .GroupBy(d => d.TypeDecision?.Nom ?? d.TypeDecision?.Code ?? "(sans type)")
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

    /// <summary>
    /// Admin / DP / Secrétariat : tout. Chef : Fiches/Décisions (+ détail école si présent).
    /// Contrôleur : Ordres / Fiches / Rapports.
    /// </summary>
    private IEnumerable<Models.Entities.JournalEntry> FilterJournal(string role, string? ecoleId)
    {
        var all = _users.JournalActivite.AsEnumerable();
        return role switch
        {
            DataScope.RoleAdmin or DataScope.RoleDp or DataScope.RoleSecretariat => all,
            DataScope.RoleChef => all.Where(j =>
            {
                if (j.Module is not ("Fiches" or "Décisions")) return false;
                if (string.IsNullOrEmpty(ecoleId)) return true;
                return string.IsNullOrEmpty(j.Detail)
                       || j.Detail.Contains(ecoleId, StringComparison.OrdinalIgnoreCase);
            }),
            DataScope.RoleControleur => all.Where(j =>
                j.Module is "Ordres de mission" or "Fiches" or "Rapports"),
            _ => Enumerable.Empty<Models.Entities.JournalEntry>()
        };
    }
}
