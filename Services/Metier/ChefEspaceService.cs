using inspect_san.Interface;
using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class ChefEspaceService : IChefEspaceService
{
    private readonly InspectSanDbContext _db;

    public ChefEspaceService(InspectSanDbContext db) => _db = db;

    public async Task<ChefEspaceViewModel> GetEspaceAsync(string? ecoleId, bool canValiderFiche, CancellationToken ct = default)
    {
        var vm = new ChefEspaceViewModel
        {
            EcoleId = ecoleId,
            HasEcoleId = !string.IsNullOrWhiteSpace(ecoleId),
            CanValiderFiche = canValiderFiche
        };

        if (!vm.HasEcoleId)
        {
            vm.WarningMessage = "Aucun établissement n’est lié à votre compte. Contactez l’administrateur.";
            return vm;
        }

        var ecole = await _db.Ecoles.AsNoTracking()
            .Include(e => e.Regime)
            .Include(e => e.Commune)
            .FirstOrDefaultAsync(e => e.Id == ecoleId, ct);

        if (ecole == null)
        {
            vm.WarningMessage = "L’établissement lié à votre compte est introuvable.";
            return vm;
        }

        vm.Ecole = new EcoleResumeVm
        {
            Id = ecole.Id,
            Denomination = ecole.Denomination,
            Regime = ecole.Regime?.Nom,
            Commune = ecole.Commune?.Nom,
            Quartier = ecole.Adresse?.Quartier,
            Avenue = ecole.Adresse?.Avenue,
            Numero = ecole.Adresse?.Numero,
            Statut = ecole.Statut,
            IdDinacope = ecole.IdDinacope,
            NumAgrement = ecole.NumAgrement,
            NumNotification = ecole.NumNotification
        };

        var chef = await _db.Chefs.AsNoTracking()
            .Where(c => c.EcoleId == ecoleId)
            .OrderBy(c => c.CreatedAt)
            .FirstOrDefaultAsync(ct);

        if (chef != null)
        {
            vm.Profil = new ChefProfilVm
            {
                Id = chef.Id,
                NomComplet = chef.NomComplet,
                Telephone = chef.Telephone,
                IdDinacope = chef.IdDinacope,
                AncienneteEnseignement = chef.AncienneteEnseignement,
                AncienneteChef = chef.AncienneteChef,
                AncienneteEcole = chef.AncienneteEcole
            };
        }

        var fiches = await _db.FichesControle.AsNoTracking()
            .Where(f => f.EcoleId == ecoleId)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync(ct);

        var omIds = fiches.Select(f => f.OrdreMissionId).Distinct().ToList();
        var omNumeros = await _db.OrdresMission.AsNoTracking()
            .Where(o => omIds.Contains(o.Id))
            .ToDictionaryAsync(o => o.Id, o => o.Numero, ct);

        vm.Fiches = fiches.Select(f =>
        {
            var bat = f.SectionBatiments ?? new Models.Entities.SectionBatiments();
            var imp = f.SectionImpact7 ?? new Models.Entities.SectionImpact7();
            return new FicheResumeVm
            {
                Id = f.Id,
                Numero = f.Numero,
                Statut = f.Statut,
                OrdreMissionNumero = omNumeros.GetValueOrDefault(f.OrdreMissionId),
                CreatedAt = f.CreatedAt,
                ValideeLe = f.ValideeLe,
                PeutValider = canValiderFiche && f.Statut == FicheStatuts.EnAttenteValidation,
                Observations = f.Observations,
                RecommandationPreliminaire = f.RecommandationPreliminaire,
                ProduitsAutres = f.ProduitsAutres ?? "",
                NombreBatiments = bat.NombreBatiments,
                EtatGeneral = bat.EtatGeneral,
                NombreEleves = bat.NombreEleves,
                ToilettesFilles = bat.ToilettesFilles ?? "",
                ToilettesGarcons = bat.ToilettesGarcons ?? "",
                MontantPercu = imp.MontantPercu ?? "",
                Quantite = imp.Quantite ?? "",
                ProduitsNettoyage = imp.ProduitsNettoyage?.ToList() ?? new List<string>(),
                Photos = (f.Photos ?? new List<Models.Entities.PhotoMeta>())
                    .Select(p => new FichePhotoVm
                    {
                        Nom = p.Nom ?? "",
                        Legende = p.Legende ?? "",
                        Url = p.Url ?? ""
                    }).ToList()
            };
        }).ToList();

        vm.FichesBrouillonCount = fiches.Count(f =>
            f.Statut is FicheStatuts.Brouillon or FicheStatuts.EnAttenteValidation);
        vm.FichesValideesCount = fiches.Count(f => f.Statut == FicheStatuts.Validee);

        var decisions = await _db.Decisions.AsNoTracking()
            .Include(d => d.TypeDecision)
            .Include(d => d.Rapport)
            .Where(d => d.EcoleId == ecoleId)
            .OrderByDescending(d => d.DecideLe ?? d.CreatedAt)
            .ToListAsync(ct);

        vm.Decisions = decisions.Select(d => new DecisionResumeVm
        {
            Id = d.Id,
            Numero = d.Numero,
            Type = d.TypeDecision?.Nom ?? d.TypeDecision?.Libelle,
            StatutExecution = d.StatutExecution,
            DecideLe = d.DecideLe,
            DelaiExecution = d.DelaiExecution,
            Motif = d.Motif,
            Commentaire = d.Commentaire,
            RapportNumero = d.Rapport?.Numero
        }).ToList();

        vm.DecisionsEnAttenteCount = decisions.Count(d => d.StatutExecution == StatutsExecution.EnAttente);

        return vm;
    }
}
