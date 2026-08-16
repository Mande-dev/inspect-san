using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using inspect_san.Filters;
using inspect_san.Models.Constants;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using inspect_san.Interface;
using inspect_san.Services;
using inspect_san.ViewModels;

namespace inspect_san.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly IDashboardService _dashboard;
    private readonly IEcolesService _ecoles;
    private readonly IChefsService _chefs;
    private readonly IControleursService _controleurs;
    private readonly IUtilisateursService _utilisateurs;
    private readonly IOrdresMissionService _ordres;
    private readonly IFichesControleService _fiches;
    private readonly IRapportsService _rapports;
    private readonly IAccusesService _accuses;
    private readonly IDecisionsService _decisions;
    private readonly IStatistiquesService _statistiques;
    private readonly IParametresService _parametres;
    private readonly IJournalService _journal;
    private readonly INotificationsService _notifications;
    private readonly UserManager<ApplicationUser> _userManager;

    private UserDataScope? _scopeCache;

    public HomeController(
        IDashboardService dashboard,
        IEcolesService ecoles,
        IChefsService chefs,
        IControleursService controleurs,
        IUtilisateursService utilisateurs,
        IOrdresMissionService ordres,
        IFichesControleService fiches,
        IRapportsService rapports,
        IAccusesService accuses,
        IDecisionsService decisions,
        IStatistiquesService statistiques,
        IParametresService parametres,
        IJournalService journal,
        INotificationsService notifications,
        UserManager<ApplicationUser> userManager)
    {
        _dashboard = dashboard;
        _ecoles = ecoles;
        _chefs = chefs;
        _controleurs = controleurs;
        _utilisateurs = utilisateurs;
        _ordres = ordres;
        _fiches = fiches;
        _rapports = rapports;
        _accuses = accuses;
        _decisions = decisions;
        _statistiques = statistiques;
        _parametres = parametres;
        _journal = journal;
        _notifications = notifications;
        _userManager = userManager;
    }

    private string Role => User.FindFirstValue(ClaimTypes.Role) ?? "";
    private string? UserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    private bool Can(string action) => AccessControl.CanDo(Role, action);

    private async Task<UserDataScope> ScopeAsync()
    {
        if (_scopeCache != null) return _scopeCache;
        string? ecoleId = null;
        string? equipeId = null;
        if (!string.IsNullOrEmpty(UserId) && (Role == DataScope.RoleChef || Role == DataScope.RoleControleur))
        {
            var user = await _userManager.FindByIdAsync(UserId);
            if (Role == DataScope.RoleChef) ecoleId = user?.EcoleId;
            if (Role == DataScope.RoleControleur) equipeId = user?.EquipeId;
        }
        _scopeCache = DataScope.Resolve(Role, UserId, ecoleId, equipeId);
        return _scopeCache;
    }

    private async Task<HashSet<string>> AllowedOrdreIdsAsync(UserDataScope scope)
    {
        if (scope.Unrestricted || string.IsNullOrEmpty(scope.EquipeId))
            return new HashSet<string>();
        var list = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        return list.Where(o => o.EquipeId == scope.EquipeId)
            .Select(o => o.Id).ToHashSet();
    }

    private IActionResult? DenyPage(string action)
    {
        if (Can(action)) return null;
        TempData["Toast"] = "Action non autorisée pour votre rôle.";
        TempData["ToastType"] = "danger";
        return RedirectToAction(nameof(Index));
    }

    private bool TryDenyJson(string action, out IActionResult result)
    {
        if (Can(action))
        {
            result = null!;
            return false;
        }
        result = Json(ApiResultDto.Fail("Action non autorisée pour votre rôle."));
        return true;
    }

    private IActionResult DenyScopePage()
    {
        TempData["Toast"] = "Ressource hors de votre périmètre.";
        TempData["ToastType"] = "danger";
        return RedirectToAction(nameof(Index));
    }

    private IActionResult DenyScopeJson()
        => Json(ApiResultDto.Fail("Ressource hors de votre périmètre."));

    // ——— Dashboard ———

    [RequirePageAccess("dashboard")]
    public async Task<IActionResult> Index()
    {
        var scope = await ScopeAsync();
        var dto = await _dashboard.GetDashboardAsync(Role, UserId, scope.EcoleId, scope.EquipeId);
        ViewBag.Role = dto.Role;
        ViewBag.RoleTip = dto.RoleTip;
        ViewBag.EcolesCount = dto.EcolesCount;
        ViewBag.MissionsEnCours = dto.MissionsEnCours;
        ViewBag.FichesEnAttente = dto.FichesEnAttente;
        ViewBag.RapportsDeposes = dto.RapportsDeposes;
        ViewBag.DecisionsEnAttente = dto.DecisionsEnAttente;
        ViewBag.RecentJournal = dto.RecentJournal.Select(j => new JournalEntry
        {
            Id = j.Id,
            UtilisateurId = j.UtilisateurId,
            Module = j.Module,
            Action = j.Action,
            Detail = j.Detail,
            CreatedAt = j.CreatedAt
        }).ToList();
        ViewBag.PageKey = "dashboard";
        return View();
    }

    [RequirePageAccess("dashboard")]
    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        var scope = await ScopeAsync();
        return Json(await _dashboard.GetDashboardAsync(Role, UserId, scope.EcoleId, scope.EquipeId));
    }

    [AllowAnonymous]
    public IActionResult Error() => View();

    /// <summary>Page 404 — réexécutée via StatusCodePages (HTTP 404 conservé).</summary>
    [AllowAnonymous]
    [HttpGet]
    public IActionResult PageNotFound()
    {
        Response.StatusCode = StatusCodes.Status404NotFound;
        if (User.Identity?.IsAuthenticated == true)
        {
            var (controller, action) = AccessControl.DefaultLanding(Role);
            ViewBag.EspaceUrl = Url.Action(action, controller) ?? "/";
            ViewBag.EspaceLabel = "Mon espace";
        }
        else
        {
            ViewBag.EspaceUrl = Url.Action("Index", "Landing") ?? "/";
            ViewBag.EspaceLabel = "Accueil";
        }

        return View("NotFound");
    }

    // ——— Écoles ———

    [RequirePageAccess("ecoles")]
    public async Task<IActionResult> Ecoles(string? q, string? commune, string? regime, string? statut)
    {
        var scope = await ScopeAsync();
        var filter = new EcoleFilterDto { Q = q, Commune = commune, Regime = regime, Statut = statut };
        var (communes, regimes) = await _ecoles.GetLookupsAsync();
        ViewBag.PageKey = "ecoles";
        ViewBag.Communes = communes;
        ViewBag.Regimes = regimes;
        ViewBag.Q = q;
        ViewBag.Commune = commune;
        ViewBag.Regime = regime;
        ViewBag.Statut = statut;
        ViewBag.CanGererEcole = Can(AccessActions.GererEcole);
        var list = await _ecoles.QueryEntitiesAsync(filter);
        if (!scope.Unrestricted)
            list = list.Where(e => scope.AllowsEcole(e.Id)).ToList();
        return View(list);
    }

    [RequirePageAccess("ecoles"), HttpGet]
    public async Task<IActionResult> GetEcoles([FromQuery] EcoleFilterDto filter)
    {
        var scope = await ScopeAsync();
        var list = await _ecoles.ListAsync(filter);
        if (!scope.Unrestricted)
            list = list.Where(e => scope.AllowsEcole(e.Id)).ToList();
        return Json(list);
    }

    [RequirePageAccess("ecoles"), HttpGet]
    public async Task<IActionResult> GetEcole(string id)
    {
        var scope = await ScopeAsync();
        if (!scope.AllowsEcole(id))
            return DenyScopeJson();
        return Json(await _ecoles.GetAsync(id));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> SaveEcole(EcoleFormViewModel model, string? DocumentsJson)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.SaveAsync(new SaveEcoleDto
        {
            Id = model.Id,
            Denomination = model.Denomination,
            RegimeId = model.RegimeId,
            IdDinacope = model.IdDinacope,
            NumAgrement = model.NumAgrement,
            NumNotification = model.NumNotification,
            CommuneId = model.CommuneId,
            Quartier = model.Quartier,
            Avenue = model.Avenue,
            Numero = model.Numero,
            Statut = model.Statut,
            DocumentsJson = DocumentsJson
        });
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(Ecoles));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> SaveEcoleJson([FromBody] SaveEcoleDto dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.SaveAsync(dto));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> UploadEcoleDocument(string ecoleId, IFormFile file)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.UploadDocumentAsync(ecoleId, file));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeleteEcole(string id)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.DeleteAsync(id);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        if (!result.Success && result.SuggestDeactivate)
            TempData["SuggestDeactivateId"] = id;
        return RedirectToAction(nameof(Ecoles));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeleteEcoleJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.DeleteAsync(dto.Id));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeactivateEcole(string id)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.DeactivateAsync(id);
        TempData["Toast"] = result.Message;
        return RedirectToAction(nameof(Ecoles));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeactivateEcoleJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.DeactivateAsync(dto.Id));
    }

    // ——— Chefs ———

    [RequirePageAccess("chefs")]
    public async Task<IActionResult> Chefs(string? q, string? ecoleId)
    {
        ViewBag.PageKey = "chefs";
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        ViewBag.Q = q;
        ViewBag.EcoleId = ecoleId;
        return View(await _chefs.QueryEntitiesAsync(new ChefFilterDto { Q = q, EcoleId = ecoleId }));
    }

    [RequirePageAccess("chefs"), HttpGet]
    public async Task<IActionResult> GetChefs([FromQuery] ChefFilterDto filter)
        => Json(await _chefs.ListAsync(filter));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> SaveChef(Chef model)
    {
        var result = await _chefs.SaveAsync(new SaveChefDto
        {
            Id = model.Id,
            NomComplet = model.NomComplet,
            IdDinacope = model.IdDinacope,
            Telephone = model.Telephone,
            EcoleId = model.EcoleId,
            AncienneteEnseignement = model.AncienneteEnseignement,
            AncienneteChef = model.AncienneteChef,
            AncienneteEcole = model.AncienneteEcole
        });
        TempData["Toast"] = result.Message;
        return RedirectToAction(nameof(Chefs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> SaveChefJson([FromBody] SaveChefDto dto)
        => Json(await _chefs.SaveAsync(dto));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> DeleteChef(string id)
    {
        TempData["Toast"] = (await _chefs.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Chefs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> DeleteChefJson([FromBody] IdRequest dto)
        => Json(await _chefs.DeleteAsync(dto.Id));

    // ——— Contrôleurs (membres d’équipe, sans login) ———

    [RequirePageAccess("controleurs")]
    public async Task<IActionResult> Controleurs(string? q, string? equipeId)
    {
        ViewBag.PageKey = "controleurs";
        var equipes = await _parametres.QueryEntitiesAsync("equipes");
        ViewBag.Equipes = equipes;
        ViewBag.ChefControleurIds = equipes
            .Where(e => !string.IsNullOrEmpty(e.ChefControleurId))
            .Select(e => e.ChefControleurId!)
            .ToHashSet(StringComparer.Ordinal);
        ViewBag.Q = q;
        ViewBag.EquipeId = equipeId;
        ViewBag.CanGerer = Can(AccessActions.GererControleurs);
        return View(await _controleurs.QueryEntitiesAsync(new ControleurFilterDto { Q = q, EquipeId = equipeId }));
    }

    [RequirePageAccess("controleurs"), HttpGet]
    public async Task<IActionResult> GetControleurs([FromQuery] ControleurFilterDto filter)
        => Json(await _controleurs.ListAsync(filter));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("controleurs")]
    public async Task<IActionResult> SaveControleur(Controleur model)
    {
        if (DenyPage(AccessActions.GererControleurs) is { } denied) return denied;
        TempData["Toast"] = (await _controleurs.SaveAsync(new SaveControleurDto
        {
            Id = model.Id,
            NomComplet = model.NomComplet,
            Telephone = model.Telephone,
            EquipeId = model.EquipeId,
            Actif = model.Actif
        })).Message;
        return RedirectToAction(nameof(Controleurs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("controleurs")]
    public async Task<IActionResult> SaveControleurJson([FromBody] SaveControleurDto dto)
    {
        if (TryDenyJson(AccessActions.GererControleurs, out var denied)) return denied;
        return Json(await _controleurs.SaveAsync(dto));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("controleurs")]
    public async Task<IActionResult> DeleteControleur(string id)
    {
        if (DenyPage(AccessActions.GererControleurs) is { } denied) return denied;
        TempData["Toast"] = (await _controleurs.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Controleurs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("controleurs")]
    public async Task<IActionResult> DeleteControleurJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererControleurs, out var denied)) return denied;
        return Json(await _controleurs.DeleteAsync(dto.Id));
    }

    // ——— Utilisateurs ———

    [RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> Utilisateurs()
    {
        ViewBag.PageKey = "utilisateurs";
        ViewBag.Equipes = await _parametres.QueryEntitiesAsync("equipes");
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        return View(await _utilisateurs.QueryEntitiesAsync());
    }

    [RequirePageAccess("utilisateurs"), HttpGet]
    public async Task<IActionResult> GetUtilisateurs()
        => Json(await _utilisateurs.ListAsync());

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SaveUtilisateur(Utilisateur model)
    {
        // Création uniquement — Id ignoré / refusé côté service.
        var result = await _utilisateurs.CreateAsync(new SaveUtilisateurDto
        {
            Nom = model.Nom,
            Contact = model.Contact,
            Role = model.Role,
            Equipe = model.Equipe,
            EquipeId = model.EquipeId,
            ControleurId = model.ControleurId,
            Statut = model.Statut,
            MotDePasse = model.MotDePasse,
            ConfirmationMotDePasse = model.ConfirmationMotDePasse,
            Telephone = model.Telephone,
            EcoleId = model.EcoleId
        });
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(Utilisateurs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SaveUtilisateurJson([FromBody] SaveUtilisateurDto dto)
    {
        // Refuse toute modification (Id rempli) via CreateAsync / SaveAsync.
        dto.Id = string.IsNullOrWhiteSpace(dto.Id) ? null : dto.Id;
        return Json(await _utilisateurs.SaveAsync(dto));
    }

    [RequirePageAccess("utilisateurs"), HttpGet]
    public async Task<IActionResult> GetChefsEquipeSansCompte(string? excludeUserId = null)
        => Json(await _utilisateurs.ListChefsEquipeSansCompteAsync(excludeUserId));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SetUtilisateurStatut(string id, string statut)
    {
        var result = await _utilisateurs.SetStatutAsync(id, statut);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(Utilisateurs));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SetUtilisateurStatutJson([FromBody] SetStatutRequest? dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Id) || string.IsNullOrWhiteSpace(dto.Statut))
            return Json(ApiResultDto.Fail("Requête invalide."));
        return Json(await _utilisateurs.SetStatutAsync(dto.Id, dto.Statut));
    }

    // ——— Ordres ———

    [RequirePageAccess("ordres")]
    public async Task<IActionResult> OrdresMission(string? q, string? statut)
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "ordres";
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        ViewBag.Equipes = await _parametres.QueryEntitiesAsync("equipes");
        ViewBag.CanGererOrdre = Can(AccessActions.GererOrdre);
        ViewBag.CanSigner = Can(AccessActions.SignerOrdre);
        ViewBag.Q = q;
        ViewBag.Statut = statut;
        var list = await _ordres.QueryEntitiesAsync(new OrdreFilterDto { Q = q, Statut = statut });
        if (!scope.Unrestricted)
            list = list.Where(o => scope.AllowsOrdre(o.EquipeId, o.EcoleId)).ToList();
        return View(list);
    }

    [RequirePageAccess("ordres"), HttpGet]
    public async Task<IActionResult> GetOrdres([FromQuery] OrdreFilterDto filter)
    {
        var scope = await ScopeAsync();
        var list = await _ordres.ListAsync(filter);
        if (!scope.Unrestricted)
            list = list.Where(o => scope.AllowsOrdre(o.EquipeId, o.EcoleId)).ToList();
        return Json(list);
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> SaveOrdre(OrdreMission model)
    {
        if (DenyPage(AccessActions.GererOrdre) is { } denied) return denied;
        TempData["Toast"] = (await _ordres.SaveAsync(new SaveOrdreMissionDto
        {
            Id = model.Id,
            EcoleId = model.EcoleId,
            EquipeId = model.EquipeId,
            Statut = model.Statut,
            DateEmission = model.DateEmission,
            DebutValidite = model.DebutValidite,
            FinValidite = model.FinValidite,
            Objet = model.Objet
        })).Message;
        return RedirectToAction(nameof(OrdresMission));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> SaveOrdreJson([FromBody] SaveOrdreMissionDto dto)
    {
        if (TryDenyJson(AccessActions.GererOrdre, out var denied)) return denied;
        return Json(await _ordres.SaveAsync(dto));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> SignerOrdre(string id)
    {
        if (DenyPage(AccessActions.SignerOrdre) is { } denied) return denied;
        TempData["Toast"] = (await _ordres.SignerAsync(id, UserId)).Message;
        return RedirectToAction(nameof(OrdresMission));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> SignerOrdreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.SignerOrdre, out var denied)) return denied;
        return Json(await _ordres.SignerAsync(dto.Id, UserId));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> DemanderSignatureOrdreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererOrdre, out var denied)) return denied;
        return Json(await _ordres.DemanderSignatureAsync(dto.Id, UserId));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> PasserEnCoursOrdreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererOrdre, out var denied)) return denied;
        return Json(await _ordres.PasserEnCoursAsync(dto.Id, UserId));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> CloturerOrdreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererOrdre, out var denied)) return denied;
        return Json(await _ordres.CloturerAsync(dto.Id, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> DeleteOrdre(string id)
    {
        if (DenyPage(AccessActions.GererOrdre) is { } denied) return denied;
        TempData["Toast"] = (await _ordres.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(OrdresMission));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ordres")]
    public async Task<IActionResult> DeleteOrdreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererOrdre, out var denied)) return denied;
        return Json(await _ordres.DeleteAsync(dto.Id));
    }
    // ——— Fiches ———

    [RequirePageAccess("fiches")]
    public async Task<IActionResult> FichesControle(string? q, string? statut)
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "fiches";
        var allOrdres = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        if (!scope.Unrestricted)
            allOrdres = allOrdres.Where(o => scope.AllowsOrdre(o.EquipeId, o.EcoleId)).ToList();
        ViewBag.OrdresSignes = allOrdres.Where(o => o.Statut is "signe" or "en_cours").ToList();
        ViewBag.AllOrdres = allOrdres;
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        if (!scope.Unrestricted)
            ecoles = ecoles.Where(e => scope.AllowsEcole(e.Id) || allOrdres.Any(o => o.EcoleId == e.Id)).ToList();
        ViewBag.Ecoles = ecoles;
        ViewBag.Chefs = await _chefs.QueryEntitiesAsync(new ChefFilterDto());
        ViewBag.Produits = new[] { "Javel", "Savon", "Détergent", "Serpillère", "Seau", "Balai" };
        ViewBag.Etats = EtatBatiment.FormOptions;
        ViewBag.Recommandations = new[] { "Maintien", "Avertissement", "Réhabilitation", "Fermeture temporaire", "Fermeture définitive" };
        ViewBag.CanCreerFiche = Can(AccessActions.CreerFiche);
        ViewBag.CanValider = Can(AccessActions.ValiderFiche);
        ViewBag.Q = q;
        ViewBag.Statut = statut;
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto { Q = q, Statut = statut });
        var omIds = allOrdres.Select(o => o.Id).ToHashSet();
        var ordreEquipe = allOrdres.ToDictionary(o => o.Id, o => o.EquipeId);
        if (!scope.Unrestricted)
            fiches = fiches.Where(f => scope.AllowsFiche(
                ordreEquipe.GetValueOrDefault(f.OrdreMissionId), f.EcoleId, omIds, f.OrdreMissionId)).ToList();
        return View(fiches);
    }

    [RequirePageAccess("fiches"), HttpGet]
    public async Task<IActionResult> GetFiches([FromQuery] FicheFilterDto filter)
    {
        var scope = await ScopeAsync();
        var list = await _fiches.ListAsync(filter);
        var omIds = await AllowedOrdreIdsAsync(scope);
        var ordres = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        var ordreEquipe = ordres.ToDictionary(o => o.Id, o => o.EquipeId);
        if (!scope.Unrestricted)
            list = list.Where(f => scope.AllowsFiche(
                ordreEquipe.GetValueOrDefault(f.OrdreMissionId), f.EcoleId, omIds, f.OrdreMissionId)).ToList();
        return Json(list);
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SaveFiche(
        string? Id, string OrdreMissionId, string Statut,
        int? NombreBatiments, string? EtatGeneral, int? NombreEleves,
        string? ToilettesFilles, string? ToilettesGarcons,
        string? MontantPercu, string? Quantite, string? ProduitsAutres,
        string? Observations, string? RecommandationPreliminaire,
        string[]? ProduitsNettoyage, string? PhotosJson)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        var ordres = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        var ordre = ordres.FirstOrDefault(o => o.Id == OrdreMissionId);
        if (ordre == null || !scope.AllowsOrdre(ordre.EquipeId, ordre.EcoleId))
            return DenyScopePage();
        var result = await _fiches.SaveAsync(new SaveFicheControleDto
        {
            Id = Id,
            OrdreMissionId = OrdreMissionId,
            Statut = Statut,
            NombreBatiments = NombreBatiments ?? 0,
            EtatGeneral = EtatGeneral ?? "Satisfaisant",
            NombreEleves = NombreEleves ?? 0,
            ToilettesFilles = ToilettesFilles ?? "",
            ToilettesGarcons = ToilettesGarcons ?? "",
            MontantPercu = MontantPercu ?? "",
            Quantite = Quantite ?? "",
            ProduitsAutres = ProduitsAutres ?? "",
            Observations = Observations,
            RecommandationPreliminaire = RecommandationPreliminaire ?? "Maintien",
            ProduitsNettoyage = ProduitsNettoyage,
            PhotosJson = PhotosJson
        });
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(FichesControle));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SaveFicheJson([FromBody] SaveFicheControleDto dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        var ordres = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        var ordre = ordres.FirstOrDefault(o => o.Id == dto.OrdreMissionId);
        if (ordre == null || !scope.AllowsOrdre(ordre.EquipeId, ordre.EcoleId))
            return DenyScopeJson();
        return Json(await _fiches.SaveAsync(dto));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> UploadFichePhoto(string ficheId, IFormFile file, string? legende = null)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        return Json(await _fiches.UploadPhotoAsync(ficheId, file, legende));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SoumettreFiche(string id)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == id);
        if (fiche == null)
            return DenyScopePage();
        var ordre = (await _ordres.QueryEntitiesAsync(new OrdreFilterDto())).FirstOrDefault(o => o.Id == fiche.OrdreMissionId);
        if (!scope.AllowsFiche(ordre?.EquipeId, fiche.EcoleId, omIds, fiche.OrdreMissionId))
            return DenyScopePage();
        var result = await _fiches.SoumettrePourValidationAsync(id, UserId);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(FichesControle));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SoumettreFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == dto.Id);
        if (fiche == null)
            return DenyScopeJson();
        var ordre = (await _ordres.QueryEntitiesAsync(new OrdreFilterDto())).FirstOrDefault(o => o.Id == fiche.OrdreMissionId);
        if (!scope.AllowsFiche(ordre?.EquipeId, fiche.EcoleId, omIds, fiche.OrdreMissionId))
            return DenyScopeJson();
        return Json(await _fiches.SoumettrePourValidationAsync(dto.Id, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> ValiderFiche(string id)
    {
        if (DenyPage(AccessActions.ValiderFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == id);
        if (fiche == null || !scope.AllowsEcole(fiche.EcoleId))
            return DenyScopePage();
        TempData["Toast"] = (await _fiches.ValiderAsync(id, UserId)).Message;
        return RedirectToAction(nameof(FichesControle));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> ValiderFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.ValiderFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == dto.Id);
        if (fiche == null || !scope.AllowsEcole(fiche.EcoleId))
            return DenyScopeJson();
        return Json(await _fiches.ValiderAsync(dto.Id, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> DeleteFiche(string id)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == id);
        if (fiche == null)
            return DenyScopePage();
        var ordre = (await _ordres.QueryEntitiesAsync(new OrdreFilterDto())).FirstOrDefault(o => o.Id == fiche.OrdreMissionId);
        if (!scope.AllowsFiche(ordre?.EquipeId, fiche.EcoleId, omIds, fiche.OrdreMissionId))
            return DenyScopePage();
        TempData["Toast"] = (await _fiches.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(FichesControle));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> DeleteFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == dto.Id);
        if (fiche == null)
            return DenyScopeJson();
        var ordre = (await _ordres.QueryEntitiesAsync(new OrdreFilterDto())).FirstOrDefault(o => o.Id == fiche.OrdreMissionId);
        if (!scope.AllowsFiche(ordre?.EquipeId, fiche.EcoleId, omIds, fiche.OrdreMissionId))
            return DenyScopeJson();
        return Json(await _fiches.DeleteAsync(dto.Id));
    }
    private async Task<Dictionary<string, string>> OrdreEquipeMapAsync()
    {
        var ordres = await _ordres.QueryEntitiesAsync(new OrdreFilterDto());
        return ordres.ToDictionary(o => o.Id, o => o.EquipeId);
    }

    private bool AllowsFicheScoped(UserDataScope scope, string? ordreMissionId, string? ecoleId,
        ISet<string> omIds, IReadOnlyDictionary<string, string> ordreEquipe)
    {
        var equipeId = !string.IsNullOrEmpty(ordreMissionId) && ordreEquipe.TryGetValue(ordreMissionId, out var eq)
            ? eq : null;
        return scope.AllowsFiche(equipeId, ecoleId, omIds, ordreMissionId);
    }

    // ——— Rapports ———

    [RequirePageAccess("rapports")]
    public async Task<IActionResult> Rapports()
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "rapports";
        var canCreer = Can(AccessActions.CreerRapport);
        ViewBag.CanCreerRapport = canCreer;

        var fichesConsommees = await _rapports.ListFicheIdsConsommeesAsync();
        ViewBag.FicheIdsConsommees = fichesConsommees;

        var fichesValidees = await _fiches.QueryEntitiesAsync(new FicheFilterDto { Statut = "validee" });
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        var rapports = await _rapports.QueryEntitiesAsync();
        var omIds = await AllowedOrdreIdsAsync(scope);
        var ordreEquipe = await OrdreEquipeMapAsync();
        var allowedFicheIds = fiches.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe))
            .Select(f => f.Id).ToHashSet();
        if (!scope.Unrestricted)
        {
            fichesValidees = fichesValidees.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe)).ToList();
            fiches = fiches.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe)).ToList();
            rapports = rapports.Where(r => scope.AllowsRapport(r.EcoleId, r.FicheIds, allowedFicheIds)).ToList();
            ecoles = ecoles.Where(e =>
                scope.AllowsEcole(e.Id) || rapports.Any(r => r.EcoleId == e.Id) || fiches.Any(f => f.EcoleId == e.Id)).ToList();
        }

        // Ne proposer au formulaire que les fiches validées non déjà déposées
        fichesValidees = fichesValidees.Where(f => !fichesConsommees.Contains(f.Id)).ToList();

        var rapportPeutDeposer = new Dictionary<string, bool>(StringComparer.Ordinal);
        foreach (var r in rapports)
        {
            if (r.Statut != "brouillon" || r.FicheIds.Count == 0)
                rapportPeutDeposer[r.Id] = false;
            else
            {
                var deja = await _rapports.FindFichesDejaConsommeesAsync(r.FicheIds, excludeRapportId: r.Id);
                rapportPeutDeposer[r.Id] = deja.Count == 0;
            }
        }
        ViewBag.RapportPeutDeposer = rapportPeutDeposer;

        ViewBag.FichesValidees = fichesValidees;
        ViewBag.Fiches = fiches;
        ViewBag.Ecoles = ecoles;
        return View(rapports);
    }

    [RequirePageAccess("rapports"), HttpGet]
    public async Task<IActionResult> GetRapports()
    {
        var scope = await ScopeAsync();
        var list = await _rapports.ListAsync();
        if (!scope.Unrestricted)
        {
            var omIds = await AllowedOrdreIdsAsync(scope);
            var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
            var ordreEquipe = await OrdreEquipeMapAsync();
            var allowedFicheIds = fiches.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe))
                .Select(f => f.Id).ToHashSet();
            list = list.Where(r => scope.AllowsRapport(r.EcoleId, r.FicheIds, allowedFicheIds)).ToList();
        }
        return Json(list);
    }

    [RequirePageAccess("rapports"), HttpPost, IgnoreAntiforgeryToken]
    public async Task<IActionResult> BuildSyntheseJson([FromBody] FicheIdsRequest dto)
        => Json(new { success = true, synthese = await _rapports.BuildSyntheseAsync(dto.FicheIds) });

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> SaveRapport(Rapport model, string[]? ficheIds)
    {
        if (DenyPage(AccessActions.CreerRapport) is { } denied) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchRapportAsync(scope, model.Id, model.EcoleId, ficheIds))
            return DenyScopePage();
        TempData["Toast"] = (await _rapports.SaveAsync(new SaveRapportDto
        {
            Id = model.Id,
            EcoleId = model.EcoleId,
            FicheIds = ficheIds,
            Synthese = model.Synthese,
            Statut = model.Statut
        })).Message;
        return RedirectToAction(nameof(Rapports));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> SaveRapportJson([FromBody] SaveRapportDto dto)
    {
        if (TryDenyJson(AccessActions.CreerRapport, out var denied)) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchRapportAsync(scope, dto.Id, dto.EcoleId, dto.FicheIds))
            return DenyScopeJson();
        return Json(await _rapports.SaveAsync(dto));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> DeposerRapport(string id)
    {
        if (DenyPage(AccessActions.CreerRapport) is { } denied) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchExistingRapportAsync(scope, id))
            return DenyScopePage();
        TempData["Toast"] = (await _rapports.DeposerAsync(id, UserId)).Message;
        return RedirectToAction(nameof(Rapports));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> DeposerRapportJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerRapport, out var denied)) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchExistingRapportAsync(scope, dto.Id))
            return DenyScopeJson();
        return Json(await _rapports.DeposerAsync(dto.Id, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> DeleteRapport(string id)
    {
        if (DenyPage(AccessActions.CreerRapport) is { } denied) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchExistingRapportAsync(scope, id))
            return DenyScopePage();
        TempData["Toast"] = (await _rapports.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Rapports));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapports")]
    public async Task<IActionResult> DeleteRapportJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerRapport, out var denied)) return denied;
        var scope = await ScopeAsync();
        if (!await CanTouchExistingRapportAsync(scope, dto.Id))
            return DenyScopeJson();
        return Json(await _rapports.DeleteAsync(dto.Id));
    }

    private async Task<bool> CanTouchExistingRapportAsync(UserDataScope scope, string id)
    {
        if (scope.Unrestricted) return true;
        var r = (await _rapports.QueryEntitiesAsync()).FirstOrDefault(x => x.Id == id);
        if (r == null) return false;
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var ordreEquipe = await OrdreEquipeMapAsync();
        var allowedFicheIds = fiches.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe))
            .Select(f => f.Id).ToHashSet();
        return scope.AllowsRapport(r.EcoleId, r.FicheIds, allowedFicheIds);
    }

    private async Task<bool> CanTouchRapportAsync(UserDataScope scope, string? id, string? ecoleId, IEnumerable<string>? ficheIds)
    {
        if (scope.Unrestricted) return true;
        if (!string.IsNullOrEmpty(id) && !await CanTouchExistingRapportAsync(scope, id))
            return false;
        var omIds = await AllowedOrdreIdsAsync(scope);
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var ordreEquipe = await OrdreEquipeMapAsync();
        var allowedFicheIds = fiches.Where(f => AllowsFicheScoped(scope, f.OrdreMissionId, f.EcoleId, omIds, ordreEquipe))
            .Select(f => f.Id).ToHashSet();
        var ids = ficheIds?.ToList() ?? [];
        if (ids.Count > 0 && ids.Any(fid => !allowedFicheIds.Contains(fid)))
            return false;
        return scope.AllowsRapport(ecoleId, ids, allowedFicheIds) || ids.Count > 0;
    }

    // ——— Accusés ———

    [RequirePageAccess("accuses")]
    public async Task<IActionResult> Accuses()
    {
        ViewBag.PageKey = "accuses";
        ViewBag.CanAccuser = Can(AccessActions.AccuserRapport);
        ViewBag.CanTransmettre = Can(AccessActions.TransmettreRapport);
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        return View(await _accuses.QueryEntitiesAsync());
    }

    [RequirePageAccess("accuses"), HttpGet]
    public async Task<IActionResult> GetAccuses([FromQuery] AccuseFilterDto filter)
        => Json(await _accuses.ListAsync(filter));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("accuses")]
    public async Task<IActionResult> Accuser(string id)
    {
        if (DenyPage(AccessActions.AccuserRapport) is { } denied) return denied;
        TempData["Toast"] = (await _accuses.AccuserAsync(id, UserId)).Message;
        return RedirectToAction(nameof(Accuses));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("accuses")]
    public async Task<IActionResult> AccuserJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.AccuserRapport, out var denied)) return denied;
        return Json(await _accuses.AccuserAsync(dto.Id, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("accuses")]
    public async Task<IActionResult> Transmettre(string id)
    {
        if (DenyPage(AccessActions.TransmettreRapport) is { } denied) return denied;
        TempData["Toast"] = (await _accuses.TransmettreAsync(id)).Message;
        return RedirectToAction(nameof(Accuses));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("accuses")]
    public async Task<IActionResult> TransmettreJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.TransmettreRapport, out var denied)) return denied;
        return Json(await _accuses.TransmettreAsync(dto.Id));
    }

    // ——— Décisions ———

    [RequirePageAccess("decisions")]
    public async Task<IActionResult> Decisions()
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "decisions";
        ViewBag.CanCreerDecision = Can(AccessActions.CreerDecision);
        ViewBag.Types = await _parametres.QueryEntitiesAsync("typesDecision");
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        var rapports = await _rapports.QueryEntitiesAsync();
        var decisions = await _decisions.QueryEntitiesAsync();
        if (!scope.Unrestricted)
        {
            ecoles = ecoles.Where(e => scope.AllowsEcole(e.Id)).ToList();
            rapports = rapports.Where(r => scope.AllowsEcole(r.EcoleId)).ToList();
            decisions = decisions.Where(d => scope.AllowsDecision(d.EcoleId)).ToList();
        }
        ViewBag.Ecoles = ecoles;
        ViewBag.Rapports = rapports;
        ViewBag.RapportsSansDecision = Can(AccessActions.CreerDecision)
            ? await _decisions.QueryRapportsSansDecisionAsync()
            : new List<Rapport>();
        return View(decisions);
    }

    [RequirePageAccess("decisions"), HttpGet]
    public async Task<IActionResult> GetDecisions()
    {
        var scope = await ScopeAsync();
        var decisions = await _decisions.ListAsync();
        var sans = Can(AccessActions.CreerDecision)
            ? await _decisions.RapportsSansDecisionAsync()
            : Array.Empty<RapportListDto>();
        if (!scope.Unrestricted)
        {
            decisions = decisions.Where(d => scope.AllowsDecision(d.EcoleId)).ToList();
            sans = sans.Where(r => scope.AllowsEcole(r.EcoleId)).ToList();
        }
        return Json(new { decisions, sansDecision = sans });
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> SaveDecision(Decision model)
    {
        if (DenyPage(AccessActions.CreerDecision) is { } denied) return denied;
        TempData["Toast"] = (await _decisions.SaveAsync(new SaveDecisionDto
        {
            Id = model.Id,
            RapportId = model.RapportId,
            EcoleId = model.EcoleId,
            TypeDecisionId = model.TypeDecisionId,
            DelaiExecution = model.DelaiExecution,
            StatutExecution = model.StatutExecution,
            Motif = model.Motif,
            Commentaire = model.Commentaire
        }, UserId)).Message;
        return RedirectToAction(nameof(Decisions));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> SaveDecisionJson([FromBody] SaveDecisionDto dto)
    {
        if (TryDenyJson(AccessActions.CreerDecision, out var denied)) return denied;
        return Json(await _decisions.SaveAsync(dto, UserId));
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> DeleteDecision(string id)
    {
        if (DenyPage(AccessActions.CreerDecision) is { } denied) return denied;
        TempData["Toast"] = (await _decisions.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Decisions));
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> DeleteDecisionJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerDecision, out var denied)) return denied;
        return Json(await _decisions.DeleteAsync(dto.Id));
    }
    // ——— Statistiques ———

    [RequirePageAccess("statistiques")]
    public async Task<IActionResult> Statistiques()
    {
        var (communes, regimes) = await _ecoles.GetLookupsAsync();
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var decisions = await _decisions.QueryEntitiesAsync();
        ViewBag.PageKey = "statistiques";
        ViewBag.Communes = communes;
        ViewBag.Regimes = regimes;
        ViewBag.EcolesJson = ecoles.Select(e => new
        {
            id = e.Id,
            regime = e.Regime?.Nom ?? "",
            statut = e.Statut,
            commune = e.Commune?.Nom ?? ""
        }).ToList();
        ViewBag.FichesJson = fiches.Select(f => new
        {
            id = f.Id,
            ecoleId = f.EcoleId,
            createdAt = f.CreatedAt,
            etatGeneral = f.SectionBatiments.EtatGeneral,
            montantPercu = f.SectionImpact7.MontantPercu,
            produitsCount = f.SectionImpact7.ProduitsNettoyage?.Count ?? 0
        }).ToList();
        ViewBag.DecisionsJson = decisions.Select(d => new
        {
            id = d.Id,
            ecoleId = d.EcoleId,
            type = d.TypeDecision?.Nom ?? d.TypeDecision?.Code ?? "",
            decideLe = d.DecideLe,
            createdAt = d.CreatedAt
        }).ToList();
        return View();
    }

    [RequirePageAccess("statistiques"), HttpGet]
    public async Task<IActionResult> GetStatistiques([FromQuery] StatistiquesFilterDto filter)
        => Json(await _statistiques.GetAsync(filter));

    [RequirePageAccess("statistiques"), HttpGet]
    public async Task<IActionResult> ExportStatistiquesCsv([FromQuery] StatistiquesFilterDto filter)
    {
        var csv = await _statistiques.ExportCsvAsync(filter);
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "statistiques-inspect-san.csv");
    }

    // ——— Paramètres ———

    [RequirePageAccess("parametres")]
    public async Task<IActionResult> Parametres(string tab = "communes")
    {
        ViewBag.PageKey = "parametres";
        ViewBag.Tab = tab;
        ViewBag.Items = await _parametres.QueryEntitiesAsync(tab);
        return View();
    }

    [RequirePageAccess("parametres"), HttpGet]
    public async Task<IActionResult> GetParametres(string tab = "communes")
        => Json(await _parametres.ListAsync(tab));

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> SaveParametre(string tab, RefItem model)
    {
        TempData["Toast"] = (await _parametres.SaveAsync(tab, new SaveRefItemDto
        {
            Id = model.Id,
            Nom = model.Nom,
            Code = model.Code,
            Libelle = model.Libelle,
            Actif = model.Actif
        })).Message;
        return RedirectToAction(nameof(Parametres), new { tab });
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> SaveParametreJson(string tab, [FromBody] SaveRefItemDto dto)
        => Json(await _parametres.SaveAsync(tab, dto));

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> SaveEquipeJson([FromBody] SaveEquipeDto dto)
        => Json(await _parametres.SaveEquipeAsync(dto));

    [RequirePageAccess("parametres"), HttpGet]
    public async Task<IActionResult> GetControleursPourEquipe(string? equipeId = null)
    {
        // Uniquement les membres de l’équipe concernée (ex. équipe B → membres de B seulement).
        if (string.IsNullOrWhiteSpace(equipeId))
            return Json(Array.Empty<object>());

        var list = await _controleurs.ListAsync(new ControleurFilterDto { EquipeId = equipeId });
        var options = list
            .Where(c => c.Actif)
            .Select(c => new
            {
                c.Id,
                c.NomComplet,
                c.EquipeId,
                c.EquipeNom,
                c.EstChefEquipe
            });
        return Json(options);
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> DeleteParametre(string tab, string id)
    {
        TempData["Toast"] = (await _parametres.DeleteAsync(tab, id)).Message;
        return RedirectToAction(nameof(Parametres), new { tab });
    }

    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> DeleteParametreJson(string tab, [FromBody] IdRequest dto)
        => Json(await _parametres.DeleteAsync(tab, dto.Id));

    // ——— Journal ———

    [RequirePageAccess("journal")]
    public async Task<IActionResult> Journal(string? q, string? userId, string? module)
    {
        ViewBag.PageKey = "journal";
        ViewBag.Users = await _utilisateurs.QueryEntitiesAsync();
        ViewBag.Q = q;
        ViewBag.UserId = userId;
        ViewBag.Module = module;
        return View(await _journal.QueryEntitiesAsync(new JournalFilterDto { Q = q, UserId = userId, Module = module }));
    }

    [RequirePageAccess("journal"), HttpGet]
    public async Task<IActionResult> GetJournal([FromQuery] JournalFilterDto filter)
        => Json(await _journal.ListAsync(filter));

    // ——— Notifications ———

    [Authorize, HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkNotificationRead(string id)
    {
        await _notifications.MarkReadAsync(id, UserId);
        return Redirect(Request.Headers.Referer.ToString().Length > 0 ? Request.Headers.Referer.ToString()! : "/");
    }

    [Authorize, HttpPost, IgnoreAntiforgeryToken]
    public async Task<IActionResult> MarkNotificationReadJson([FromBody] IdRequest dto)
        => Json(await _notifications.MarkReadAsync(dto.Id, UserId));

    [Authorize, HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkAllNotificationsRead()
    {
        TempData["Toast"] = (await _notifications.MarkAllReadAsync(UserId)).Message;
        return Redirect(Request.Headers.Referer.ToString().Length > 0 ? Request.Headers.Referer.ToString()! : "/");
    }

    [Authorize, HttpPost, IgnoreAntiforgeryToken]
    public async Task<IActionResult> MarkAllNotificationsReadJson()
        => Json(await _notifications.MarkAllReadAsync(UserId));
}

public class IdRequest
{
    public string Id { get; set; } = "";
}

public class SetStatutRequest
{
    public string Id { get; set; } = "";
    public string Statut { get; set; } = "";
}

public class FicheIdsRequest
{
    public List<string>? FicheIds { get; set; }
}
