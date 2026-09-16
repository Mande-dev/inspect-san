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

/// <summary>Contrôleur principal de l'espace métier Inspect-San.</summary>
[Authorize]
public class HomeController : Controller
{
    private readonly IDashboardService _dashboard;
    private readonly IEcolesService _ecoles;
    private readonly IChefsService _chefs;
    private readonly IAgentsService _agents;
    private readonly IUtilisateursService _utilisateurs;
    private readonly IMissionsService _missions;
    private readonly IFichesControleService _fiches;
    private readonly IDecisionsService _decisions;
    private readonly IStatistiquesService _statistiques;
    private readonly IParametresService _parametres;
    private readonly IJournalService _journal;
    private readonly INotificationsService _notifications;
    private readonly IMissionAccessService _missionAccess;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IAppEmailSender _emailSender;

    private UserDataScope? _scopeCache;

    /// <summary>Injecte les services métier et Identity requis par l'espace Home.</summary>
    public HomeController(
        IDashboardService dashboard,
        IEcolesService ecoles,
        IChefsService chefs,
        IAgentsService agents,
        IUtilisateursService utilisateurs,
        IMissionsService missions,
        IFichesControleService fiches,
        IDecisionsService decisions,
        IStatistiquesService statistiques,
        IParametresService parametres,
        IJournalService journal,
        INotificationsService notifications,
        IMissionAccessService missionAccess,
        UserManager<ApplicationUser> userManager,
        IAppEmailSender emailSender)
    {
        _dashboard = dashboard;
        _ecoles = ecoles;
        _chefs = chefs;
        _agents = agents;
        _utilisateurs = utilisateurs;
        _missions = missions;
        _fiches = fiches;
        _decisions = decisions;
        _statistiques = statistiques;
        _parametres = parametres;
        _journal = journal;
        _notifications = notifications;
        _missionAccess = missionAccess;
        _userManager = userManager;
        _emailSender = emailSender;
    }

    private string Role => User.FindFirstValue(ClaimTypes.Role) ?? "";
    private string? UserId => User.FindFirstValue(ClaimTypes.NameIdentifier);

    /// <summary>Indique si le rôle courant peut effectuer l'action donnée.</summary>
    private bool Can(string action) => AccessControl.CanDo(Role, action);

    /// <summary>Résout et met en cache le périmètre de données de l'utilisateur.</summary>
    private async Task<UserDataScope> ScopeAsync()
    {
        if (_scopeCache != null) return _scopeCache;
        string? agentId = null;
        if (!string.IsNullOrEmpty(UserId) && Role == DataScope.RoleControleur)
        {
            var user = await _userManager.FindByIdAsync(UserId);
            agentId = user?.AgentId;
        }
        _scopeCache = DataScope.Resolve(Role, UserId, null, agentId);
        return _scopeCache;
    }

    /// <summary>Liste les missions filtrées selon le périmètre utilisateur.</summary>
    private async Task<IReadOnlyList<MissionListDto>> MissionsScopedAsync(MissionFilterDto? filter = null)
    {
        filter ??= new MissionFilterDto();
        var list = await _missions.ListAsync(filter);
        var scope = await ScopeAsync();
        if (scope.Unrestricted) return list;
        return list.Where(m =>
            scope.AllowsMission(m.Participations.Select(p => p.AgentId), m.EcoleId)).ToList();
    }

    /// <summary>Retourne les identifiants de missions accessibles à l'agent.</summary>
    private async Task<HashSet<string>> AllowedMissionIdsAsync(UserDataScope scope)
    {
        if (scope.Unrestricted || string.IsNullOrEmpty(scope.AgentId))
            return new HashSet<string>();
        var list = await _missions.ListAsync(new MissionFilterDto());
        return list
            .Where(m => m.Participations.Any(p =>
                string.Equals(p.AgentId, scope.AgentId, StringComparison.Ordinal)))
            .Select(m => m.Id)
            .ToHashSet();
    }

    /// <summary>Extrait les identifiants d'agents participants d'une mission.</summary>
    private static IEnumerable<string> AgentIdsOf(MissionListDto? m)
        => m?.Participations.Select(p => p.AgentId) ?? Enumerable.Empty<string>();

    /// <summary>Refuse une action HTML non autorisée et redirige vers le tableau de bord.</summary>
    private IActionResult? DenyPage(string action)
    {
        if (Can(action)) return null;
        TempData["Toast"] = "Action non autorisée pour votre rôle.";
        TempData["ToastType"] = "danger";
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Refuse une action JSON non autorisée si le rôle ne le permet pas.</summary>
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

    /// <summary>Refuse une ressource hors périmètre (navigation HTML).</summary>
    private IActionResult DenyScopePage()
    {
        TempData["Toast"] = "Ressource hors de votre périmètre.";
        TempData["ToastType"] = "danger";
        return RedirectToAction(nameof(Index));
    }

    /// <summary>Refuse une ressource hors périmètre (réponse JSON).</summary>
    private IActionResult DenyScopeJson()
        => Json(ApiResultDto.Fail("Ressource hors de votre périmètre."));

    // ——— Dashboard ———

    /// <summary>Affiche le tableau de bord selon le rôle et le périmètre.</summary>
    [RequirePageAccess("dashboard")]
    public async Task<IActionResult> Index()
    {
        var scope = await ScopeAsync();
        var dto = await _dashboard.GetDashboardAsync(Role, UserId, scope.EcoleId, scope.AgentId);
        ViewBag.Role = dto.Role;
        ViewBag.RoleTip = dto.RoleTip;
        ViewBag.EcolesCount = dto.EcolesCount;
        ViewBag.MissionsEnCours = dto.MissionsEnCours;
        ViewBag.FichesEnAttente = dto.FichesEnAttente;
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

    /// <summary>Retourne les données du tableau de bord en JSON.</summary>
    [RequirePageAccess("dashboard")]
    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        var scope = await ScopeAsync();
        return Json(await _dashboard.GetDashboardAsync(Role, UserId, scope.EcoleId, scope.AgentId));
    }

    /// <summary>Affiche la page d'erreur générique.</summary>
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

    /// <summary>Affiche la liste des écoles filtrées selon le périmètre.</summary>
    [RequirePageAccess("ecoles")]
    public async Task<IActionResult> Ecoles(string? q, string? sousproved, string? regime)
    {
        var scope = await ScopeAsync();
        var filter = new EcoleFilterDto { Q = q, Sousproved = sousproved, Regime = regime };
        var (sousDivisions, regimes) = await _ecoles.GetLookupsAsync();
        var categories = await _ecoles.GetCategoriesAsync();
        ViewBag.PageKey = "ecoles";
        ViewBag.Sousproveds = sousDivisions;
        ViewBag.Regimes = regimes;
        ViewBag.Categories = categories;
        ViewBag.ChefsEtablissement = await _chefs.QueryEntitiesAsync(new ChefFilterDto());
        ViewBag.Q = q;
        ViewBag.Sousproved = sousproved;
        ViewBag.Regime = regime;
        ViewBag.CanGererEcole = Can(AccessActions.GererEcole);
        var list = await _ecoles.QueryEntitiesAsync(filter);
        if (!scope.Unrestricted)
            list = list.Where(e => scope.AllowsEcole(e.Id)).ToList();

        var allEcoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        if (!scope.Unrestricted)
            allEcoles = allEcoles.Where(e => scope.AllowsEcole(e.Id)).ToList();
        ViewBag.StatTotal = allEcoles.Count;
        ViewBag.StatAvecChef = allEcoles.Count(e => !string.IsNullOrWhiteSpace(e.MatriculeChef));
        ViewBag.StatSansChef = allEcoles.Count(e => string.IsNullOrWhiteSpace(e.MatriculeChef));
        ViewBag.StatRegimes = allEcoles.Select(e => e.RegGes).Where(r => !string.IsNullOrWhiteSpace(r)).Distinct().Count();

        return View(list);
    }

    /// <summary>Retourne la liste JSON des écoles filtrées.</summary>
    [RequirePageAccess("ecoles"), HttpGet]
    public async Task<IActionResult> GetEcoles([FromQuery] EcoleFilterDto filter)
    {
        var scope = await ScopeAsync();
        var list = await _ecoles.ListAsync(filter);
        if (!scope.Unrestricted)
            list = list.Where(e => scope.AllowsEcole(e.Id)).ToList();
        return Json(list);
    }

    /// <summary>Retourne le détail JSON d'une école si autorisée.</summary>
    [RequirePageAccess("ecoles"), HttpGet]
    public async Task<IActionResult> GetEcole(string id)
    {
        var scope = await ScopeAsync();
        if (!scope.AllowsEcole(id))
            return DenyScopeJson();
        return Json(await _ecoles.GetAsync(id));
    }

    /// <summary>Enregistre une école via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> SaveEcole(EcoleFormViewModel model)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.SaveAsync(new SaveEcoleDto
        {
            Id = model.Id,
            Denomination = model.Denomination,
            RegGes = model.RegGes,
            SousDivision = model.SousDivision,
            CodeCategories = model.CodeCategories,
            IdDinacope = model.IdDinacope,
            NumAgrement = model.NumAgrement,
            NumNotification = model.NumNotification,
            MatriculeChef = model.MatriculeChef,
            Adresse = model.Adresse
        });
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(Ecoles));
    }

    /// <summary>Enregistre une école via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> SaveEcoleJson([FromBody] SaveEcoleDto dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.SaveAsync(dto));
    }

    /// <summary>Supprime une école via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeleteEcole(string id)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.DeleteAsync(id);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : (result.Blocked ? "warning" : "danger");
        if (result.Blocked)
        {
            TempData["ToastBlocked"] = true;
            TempData["ToastTitle"] = result.Title;
            TempData["ToastDetail"] = result.Detail;
        }
        if (!result.Success && result.SuggestDeactivate)
            TempData["SuggestDeactivateId"] = id;
        return RedirectToAction(nameof(Ecoles));
    }

    /// <summary>Supprime une école via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeleteEcoleJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.DeleteAsync(dto.Id));
    }

    /// <summary>Désactive une école via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeactivateEcole(string id)
    {
        if (DenyPage(AccessActions.GererEcole) is { } denied) return denied;
        var result = await _ecoles.DeactivateAsync(id);
        TempData["Toast"] = result.Message;
        return RedirectToAction(nameof(Ecoles));
    }

    /// <summary>Désactive une école via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("ecoles")]
    public async Task<IActionResult> DeactivateEcoleJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererEcole, out var denied)) return denied;
        return Json(await _ecoles.DeactivateAsync(dto.Id));
    }

    // ——— Chefs ———

    /// <summary>Affiche la liste des chefs d'établissement.</summary>
    [RequirePageAccess("chefs")]
    public async Task<IActionResult> Chefs(string? q, string? ecoleId)
    {
        ViewBag.PageKey = "chefs";
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        ViewBag.Ecoles = ecoles;
        ViewBag.Q = q;
        ViewBag.EcoleId = ecoleId;
        ViewBag.CanGererChefs = Can(AccessActions.GererChefs);
        var chefs = await _chefs.QueryEntitiesAsync(new ChefFilterDto { Q = q, EcoleId = ecoleId });

        var allChefs = await _chefs.QueryEntitiesAsync(new ChefFilterDto());
        var assigned = ecoles
            .Where(e => !string.IsNullOrWhiteSpace(e.MatriculeChef))
            .Select(e => e.MatriculeChef!)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        ViewBag.StatTotal = allChefs.Count;
        ViewBag.StatAssignes = allChefs.Count(c => assigned.Contains(c.Matricule));
        ViewBag.StatSansEcole = allChefs.Count(c => !assigned.Contains(c.Matricule));
        ViewBag.StatAvecTel = allChefs.Count(c => !string.IsNullOrWhiteSpace(c.Telephone));

        return View(chefs);
    }

    /// <summary>Retourne la liste JSON des chefs d'établissement.</summary>
    [RequirePageAccess("chefs"), HttpGet]
    public async Task<IActionResult> GetChefs([FromQuery] ChefFilterDto filter)
        => Json(await _chefs.ListAsync(filter));

    /// <summary>Enregistre un chef via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> SaveChef(Chef model)
    {
        if (DenyPage(AccessActions.GererChefs) is { } denied) return denied;
        var result = await _chefs.SaveAsync(new SaveChefDto
        {
            Id = model.Id,
            Matricule = model.Matricule,
            NomComplet = model.NomComplet,
            Telephone = model.Telephone,
            Email = model.Email,
            AnneeDebutActivite = model.AnneeDebutActivite
        });
        TempData["Toast"] = result.Message;
        return RedirectToAction(nameof(Chefs));
    }

    /// <summary>Enregistre un chef via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> SaveChefJson([FromBody] SaveChefDto dto)
    {
        if (TryDenyJson(AccessActions.GererChefs, out var denied)) return denied;
        return Json(await _chefs.SaveAsync(dto));
    }

    /// <summary>Supprime un chef via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> DeleteChef(string id)
    {
        if (DenyPage(AccessActions.GererChefs) is { } denied) return denied;
        TempData["Toast"] = (await _chefs.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Chefs));
    }

    /// <summary>Supprime un chef via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("chefs")]
    public async Task<IActionResult> DeleteChefJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererChefs, out var denied)) return denied;
        return Json(await _chefs.DeleteAsync(dto.Id));
    }

    // ——— Agents (vivier) ———

    /// <summary>Affiche la liste des agents du vivier.</summary>
    [RequirePageAccess("agents")]
    public async Task<IActionResult> Agents(string? q, bool? actif)
    {
        ViewBag.PageKey = "agents";
        ViewBag.Q = q;
        ViewBag.Actif = actif;
        ViewBag.CanGerer = Can(AccessActions.GererAgents);
        var list = await _agents.QueryEntitiesAsync(new AgentFilterDto { Q = q, Actif = actif });

        var all = await _agents.QueryEntitiesAsync(new AgentFilterDto());
        ViewBag.StatTotal = all.Count;
        ViewBag.StatActifs = all.Count(a => a.Actif);
        ViewBag.StatInactifs = all.Count(a => !a.Actif);
        ViewBag.StatAvecTel = all.Count(a => !string.IsNullOrWhiteSpace(a.TelAgent));

        return View(list);
    }

    /// <summary>Retourne la liste JSON des agents.</summary>
    [RequirePageAccess("agents"), HttpGet]
    public async Task<IActionResult> GetAgents([FromQuery] AgentFilterDto filter)
        => Json(await _agents.ListAsync(filter));

    /// <summary>Enregistre un agent via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("agents")]
    public async Task<IActionResult> SaveAgent([FromForm] SaveAgentDto model)
    {
        if (DenyPage(AccessActions.GererAgents) is { } denied) return denied;
        TempData["Toast"] = (await _agents.SaveAsync(model)).Message;
        return RedirectToAction(nameof(Agents));
    }

    /// <summary>Enregistre un agent via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("agents")]
    public async Task<IActionResult> SaveAgentJson([FromBody] SaveAgentDto dto)
    {
        if (TryDenyJson(AccessActions.GererAgents, out var denied)) return denied;
        return Json(await _agents.SaveAsync(dto));
    }

    /// <summary>Supprime un agent via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("agents")]
    public async Task<IActionResult> DeleteAgent(string id)
    {
        if (DenyPage(AccessActions.GererAgents) is { } denied) return denied;
        TempData["Toast"] = (await _agents.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Agents));
    }

    /// <summary>Supprime un agent via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("agents")]
    public async Task<IActionResult> DeleteAgentJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererAgents, out var denied)) return denied;
        return Json(await _agents.DeleteAsync(dto.Id));
    }

    // ——— Utilisateurs ———

    /// <summary>Affiche la gestion des comptes utilisateurs.</summary>
    [RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> Utilisateurs()
    {
        ViewBag.PageKey = "utilisateurs";
        ViewBag.AgentsSansCompte = await _utilisateurs.ListAgentsSansCompteAsync();
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        return View(await _utilisateurs.ListAsync());
    }

    /// <summary>Retourne la liste JSON des utilisateurs.</summary>
    [RequirePageAccess("utilisateurs"), HttpGet]
    public async Task<IActionResult> GetUtilisateurs()
        => Json(await _utilisateurs.ListAsync());

    /// <summary>Crée un utilisateur via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SaveUtilisateur(Utilisateur model)
    {
        var result = await _utilisateurs.CreateAsync(new SaveUtilisateurDto
        {
            Nom = model.Nom,
            Contact = model.Contact,
            Role = model.Role,
            AgentId = model.AgentId,
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

    /// <summary>Enregistre un utilisateur via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SaveUtilisateurJson([FromBody] SaveUtilisateurDto dto)
    {
        dto.Id = string.IsNullOrWhiteSpace(dto.Id) ? null : dto.Id;
        return Json(await _utilisateurs.SaveAsync(dto));
    }

    /// <summary>Liste les agents sans compte utilisateur associé.</summary>
    [RequirePageAccess("utilisateurs"), HttpGet]
    public async Task<IActionResult> GetAgentsSansCompte(string? excludeUserId = null)
        => Json(await _utilisateurs.ListAgentsSansCompteAsync(excludeUserId));

    /// <summary>Change le statut d'un utilisateur via formulaire.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SetUtilisateurStatut(string id, string statut)
    {
        var result = await _utilisateurs.SetStatutAsync(id, statut);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(Utilisateurs));
    }

    /// <summary>Change le statut d'un utilisateur via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("utilisateurs")]
    public async Task<IActionResult> SetUtilisateurStatutJson([FromBody] SetStatutRequest? dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Id) || string.IsNullOrWhiteSpace(dto.Statut))
            return Json(ApiResultDto.Fail("Requête invalide."));
        return Json(await _utilisateurs.SetStatutAsync(dto.Id, dto.Statut));
    }

    // ——— Missions ———

    /// <summary>Affiche la liste des missions dans le périmètre.</summary>
    [RequirePageAccess("missions")]
    public async Task<IActionResult> Missions(string? q, string? statut)
    {
        ViewBag.PageKey = "missions";
        ViewBag.Ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        ViewBag.Agents = await _agents.QueryEntitiesAsync(new AgentFilterDto { Actif = true });
        ViewBag.RolesMission = RolesMissionCodes.Labels;
        ViewBag.CanGererMission = Can(AccessActions.GererMission);
        ViewBag.CanSigner = Can(AccessActions.SignerMission);
        ViewBag.Q = q;
        ViewBag.Statut = statut;
        return View(await MissionsScopedAsync(new MissionFilterDto { Q = q, Statut = statut }));
    }

    /// <summary>Retourne la liste JSON des missions scopées.</summary>
    [RequirePageAccess("missions"), HttpGet]
    public async Task<IActionResult> GetMissions([FromQuery] MissionFilterDto filter)
        => Json(await MissionsScopedAsync(filter));

    /// <summary>Enregistre une mission via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> SaveMission(
        string? Id, string EcoleId, string Statut,
        DateTime? DateEmission, DateTime? FinValidite,
        string[]? AgentIds, string[]? RoleMissions)
    {
        var scope = await ScopeAsync();
        var isNew = string.IsNullOrWhiteSpace(Id);
        if (isNew)
        {
            if (DenyPage(AccessActions.GererMission) is { } denied) return denied;
        }
        else if (!Can(AccessActions.GererMission)
                 && !await _missionAccess.CanWriteMissionAsync(Id!, scope.AgentId, scope.Unrestricted))
        {
            return DenyScopePage();
        }

        var participations = BuildParticipations(AgentIds, RoleMissions);
        TempData["Toast"] = (await _missions.SaveAsync(new SaveMissionDto
        {
            Id = Id,
            EcoleId = EcoleId,
            Statut = Statut,
            DateEmission = DateEmission,
            FinValidite = FinValidite,
            Participations = participations
        }, UserId)).Message;
        return RedirectToAction(nameof(Missions));
    }

    /// <summary>Enregistre une mission via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> SaveMissionJson([FromBody] SaveMissionDto dto)
    {
        var scope = await ScopeAsync();
        var isNew = string.IsNullOrWhiteSpace(dto.Id);
        if (isNew)
        {
            if (TryDenyJson(AccessActions.GererMission, out var denied)) return denied;
        }
        else if (!Can(AccessActions.GererMission)
                 && !await _missionAccess.CanWriteMissionAsync(dto.Id!, scope.AgentId, scope.Unrestricted))
        {
            return DenyScopeJson();
        }
        return Json(await _missions.SaveAsync(dto, UserId));
    }

    /// <summary>Signe une mission via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> SignerMission(string id)
    {
        if (DenyPage(AccessActions.SignerMission) is { } denied) return denied;
        TempData["Toast"] = (await _missions.SignerAsync(id, UserId)).Message;
        return RedirectToAction(nameof(Missions));
    }

    /// <summary>Signe une mission via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> SignerMissionJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.SignerMission, out var denied)) return denied;
        return Json(await _missions.SignerAsync(dto.Id, UserId));
    }

    /// <summary>Génère le PDF de l'OM et l'envoie au chef d'établissement.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> EnvoyerOrdreMissionJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererMission, out var denied)) return denied;
        return Json(await _missions.EnvoyerOrdreParMailAsync(dto.Id, UserId));
    }

    /// <summary>Demande la signature d'une mission via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> DemanderSignatureMissionJson([FromBody] IdRequest dto)
    {
        var scope = await ScopeAsync();
        if (!Can(AccessActions.GererMission)
            && !await _missionAccess.CanWriteMissionAsync(dto.Id, scope.AgentId, scope.Unrestricted))
            return DenyScopeJson();
        return Json(await _missions.DemanderSignatureAsync(dto.Id, UserId));
    }

    /// <summary>Passe une mission en cours via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> PasserEnCoursMissionJson([FromBody] IdRequest dto)
    {
        var scope = await ScopeAsync();
        if (!Can(AccessActions.GererMission)
            && !await _missionAccess.CanWriteMissionAsync(dto.Id, scope.AgentId, scope.Unrestricted))
            return DenyScopeJson();
        return Json(await _missions.PasserEnCoursAsync(dto.Id, UserId));
    }

    /// <summary>Clôture une mission via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> CloturerMissionJson([FromBody] IdRequest dto)
    {
        var scope = await ScopeAsync();
        if (!Can(AccessActions.GererMission)
            && !await _missionAccess.CanWriteMissionAsync(dto.Id, scope.AgentId, scope.Unrestricted))
            return DenyScopeJson();
        return Json(await _missions.CloturerAsync(dto.Id, UserId));
    }

    /// <summary>Délègue l'écriture mission à l'adjoint via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> DeleguerEcritureAdjointJson([FromBody] IdRequest dto)
        => Json(await _missions.DeleguerEcritureAdjointAsync(dto.Id, UserId));

    /// <summary>Retire la délégation d'écriture adjoint via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> RetirerDelegationAdjointJson([FromBody] IdRequest dto)
        => Json(await _missions.RetirerDelegationAdjointAsync(dto.Id, UserId));

    /// <summary>Supprime une mission via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> DeleteMission(string id)
    {
        var scope = await ScopeAsync();
        if (!Can(AccessActions.GererMission)
            && !await _missionAccess.CanWriteMissionAsync(id, scope.AgentId, scope.Unrestricted))
            return DenyScopePage();
        TempData["Toast"] = (await _missions.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Missions));
    }

    /// <summary>Supprime une mission via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("missions")]
    public async Task<IActionResult> DeleteMissionJson([FromBody] IdRequest dto)
    {
        var scope = await ScopeAsync();
        if (!Can(AccessActions.GererMission)
            && !await _missionAccess.CanWriteMissionAsync(dto.Id, scope.AgentId, scope.Unrestricted))
            return DenyScopeJson();
        return Json(await _missions.DeleteAsync(dto.Id));
    }

    /// <summary>Construit la liste des participations agent/rôle mission.</summary>
    private static List<SaveParticipationDto> BuildParticipations(string[]? agentIds, string[]? roleIds)
    {
        var result = new List<SaveParticipationDto>();
        if (agentIds == null || roleIds == null) return result;
        var n = Math.Min(agentIds.Length, roleIds.Length);
        for (var i = 0; i < n; i++)
        {
            if (string.IsNullOrWhiteSpace(agentIds[i]) || string.IsNullOrWhiteSpace(roleIds[i]))
                continue;
            result.Add(new SaveParticipationDto { AgentId = agentIds[i], RoleMission = roleIds[i] });
        }
        return result;
    }

    // ——— Fiches ———

    /// <summary>Affiche la liste des fiches de contrôle scopées.</summary>
    [RequirePageAccess("fiches")]
    public async Task<IActionResult> FichesControle(string? q, string? statut)
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "fiches";
        var allMissions = (await MissionsScopedAsync()).ToList();
        ViewBag.MissionsSignes = allMissions.Where(m => m.Statut is "signe" or "en_cours").ToList();
        ViewBag.AllMissions = allMissions;
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        if (!scope.Unrestricted)
            ecoles = ecoles.Where(e =>
                scope.AllowsEcole(e.Id) || allMissions.Any(m => m.EcoleId == e.Id)).ToList();
        ViewBag.Ecoles = ecoles;
        ViewBag.Chefs = await _chefs.QueryEntitiesAsync(new ChefFilterDto());
        ViewBag.Produits = await _parametres.QueryEntitiesAsync(RefCategories.Produits);
        ViewBag.Outils = await _parametres.QueryEntitiesAsync(RefCategories.Outils);
        ViewBag.Etats = EtatBatiment.FormOptions;
        ViewBag.Recommandations = DecisionTypes.Labels.Values.ToArray();
        ViewBag.CanCreerFiche = Can(AccessActions.CreerFiche);
        ViewBag.CanValider = Can(AccessActions.ValiderFiche);
        ViewBag.Q = q;
        ViewBag.Statut = statut;

        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto { Q = q, Statut = statut });
        var missionIds = allMissions.Select(m => m.Id).ToHashSet();
        var missionById = allMissions.ToDictionary(m => m.Id);
        if (!scope.Unrestricted)
        {
            fiches = fiches.Where(f =>
            {
                missionById.TryGetValue(f.MissionId, out var m);
                return scope.AllowsFiche(AgentIdsOf(m), f.EcoleId, missionIds, f.MissionId);
            }).ToList();
        }
        return View(fiches);
    }

    /// <summary>Retourne la liste JSON des fiches de contrôle.</summary>
    [RequirePageAccess("fiches"), HttpGet]
    public async Task<IActionResult> GetFiches([FromQuery] FicheFilterDto filter)
    {
        var scope = await ScopeAsync();
        var list = await _fiches.ListAsync(filter);
        var missions = await MissionsScopedAsync();
        var missionIds = missions.Select(m => m.Id).ToHashSet();
        var missionById = missions.ToDictionary(m => m.Id);
        if (!scope.Unrestricted)
        {
            list = list.Where(f =>
            {
                missionById.TryGetValue(f.MissionId, out var m);
                return scope.AllowsFiche(AgentIdsOf(m), f.EcoleId, missionIds, f.MissionId);
            }).ToList();
        }
        return Json(list);
    }

    /// <summary>Enregistre une fiche de contrôle via formulaire.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SaveFiche(
        string? Id, string MissionId, string Statut,
        int? NombreBatiments, string? EtatGeneral, int? NombreEleves,
        int? ToilettesFilles, int? ToilettesGarcons,
        string? ProduitsAutres, int? ProduitsAutresQuantite,
        string? Observations, string? RecommandationPreliminaire,
        int[]? ProduitQuantites, string? PhotosJson,
        int[]? ProduitCodes, int? CodeOutil, int? NbreOutil)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        var missions = await MissionsScopedAsync();
        var mission = missions.FirstOrDefault(m => m.Id == MissionId);
        if (mission == null || !scope.AllowsMission(AgentIdsOf(mission), mission.EcoleId))
            return DenyScopePage();
        if (!scope.Unrestricted
            && !await _missionAccess.CanWriteMissionAsync(MissionId, scope.AgentId, false))
            return DenyScopePage();
        var codes = ProduitCodes ?? [];
        var qtes = ProduitQuantites ?? [];
        var controleProduits = codes
            .Select((code, i) => new SaveControleProduitDto
            {
                ProduitCode = code,
                Quantite = i < qtes.Length ? qtes[i] : 0
            })
            .Where(c => c.ProduitCode > 0)
            .ToList();
        var result = await _fiches.SaveAsync(new SaveFicheControleDto
        {
            Id = Id,
            MissionId = MissionId,
            Statut = Statut,
            NombreBatiments = NombreBatiments ?? 0,
            EtatGeneral = EtatGeneral ?? "Satisfaisant",
            NombreEleves = NombreEleves ?? 0,
            ToilettesFilles = ToilettesFilles ?? 0,
            ToilettesGarcons = ToilettesGarcons ?? 0,
            ProduitsAutres = ProduitsAutres,
            ProduitsAutresQuantite = ProduitsAutresQuantite,
            Observations = Observations,
            RecommandationPreliminaire = RecommandationPreliminaire ?? "Maintien",
            ControleProduits = controleProduits,
            CodeOutil = CodeOutil,
            NbreOutil = NbreOutil ?? 0,
            PhotosJson = PhotosJson
        });
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(FichesControle));
    }

    /// <summary>Enregistre une fiche de contrôle via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SaveFicheJson([FromBody] SaveFicheControleDto dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        var missions = await MissionsScopedAsync();
        var mission = missions.FirstOrDefault(m => m.Id == dto.MissionId);
        if (mission == null || !scope.AllowsMission(AgentIdsOf(mission), mission.EcoleId))
            return DenyScopeJson();
        if (!scope.Unrestricted
            && !await _missionAccess.CanWriteMissionAsync(dto.MissionId, scope.AgentId, false))
            return DenyScopeJson();
        return Json(await _fiches.SaveAsync(dto));
    }

    /// <summary>Téléverse une photo associée à une fiche.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> UploadFichePhoto(string ficheId, IFormFile file, string? legende = null)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        return Json(await _fiches.UploadPhotoAsync(ficheId, file, legende));
    }

    /// <summary>Soumet une fiche pour validation via formulaire.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SoumettreFiche(string id)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        if (!await AllowsFicheIdAsync(id))
            return DenyScopePage();
        var result = await _fiches.SoumettrePourValidationAsync(id, UserId);
        TempData["Toast"] = result.Message;
        TempData["ToastType"] = result.Success ? "success" : "danger";
        return RedirectToAction(nameof(FichesControle));
    }

    /// <summary>Soumet une fiche pour validation via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> SoumettreFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        if (!await AllowsFicheIdAsync(dto.Id))
            return DenyScopeJson();
        return Json(await _fiches.SoumettrePourValidationAsync(dto.Id, UserId));
    }

    /// <summary>Valide une fiche de contrôle via formulaire.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> ValiderFiche(string id)
    {
        if (DenyPage(AccessActions.ValiderFiche) is { } denied) return denied;
        var scope = await ScopeAsync();
        if (!await AllowsFicheIdAsync(id))
            return DenyScopePage();
        if (!scope.Unrestricted
            && !await _missionAccess.CanWriteMissionAsync(id, scope.AgentId, false))
            return DenyScopePage();
        TempData["Toast"] = (await _fiches.ValiderAsync(id, UserId)).Message;
        return RedirectToAction(nameof(FichesControle));
    }

    /// <summary>Valide une fiche de contrôle via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> ValiderFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.ValiderFiche, out var denied)) return denied;
        var scope = await ScopeAsync();
        if (!await AllowsFicheIdAsync(dto.Id))
            return DenyScopeJson();
        if (!scope.Unrestricted
            && !await _missionAccess.CanWriteMissionAsync(dto.Id, scope.AgentId, false))
            return DenyScopeJson();
        return Json(await _fiches.ValiderAsync(dto.Id, UserId));
    }

    /// <summary>Supprime une fiche via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> DeleteFiche(string id)
    {
        if (DenyPage(AccessActions.CreerFiche) is { } denied) return denied;
        if (!await AllowsFicheIdAsync(id))
            return DenyScopePage();
        TempData["Toast"] = (await _fiches.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(FichesControle));
    }

    /// <summary>Supprime une fiche via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("fiches")]
    public async Task<IActionResult> DeleteFicheJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerFiche, out var denied)) return denied;
        if (!await AllowsFicheIdAsync(dto.Id))
            return DenyScopeJson();
        return Json(await _fiches.DeleteAsync(dto.Id));
    }

    /// <summary>Indique si la fiche est accessible dans le périmètre courant.</summary>
    private async Task<bool> AllowsFicheIdAsync(string id)
    {
        var scope = await ScopeAsync();
        if (scope.Unrestricted) return true;
        var fiche = (await _fiches.QueryEntitiesAsync(new FicheFilterDto())).FirstOrDefault(f => f.Id == id);
        if (fiche == null) return false;
        var missions = await MissionsScopedAsync();
        var missionIds = await AllowedMissionIdsAsync(scope);
        if (missionIds.Count == 0)
            missionIds = missions.Select(m => m.Id).ToHashSet();
        var missionById = missions.ToDictionary(m => m.Id);
        missionById.TryGetValue(fiche.MissionId, out var m);
        return scope.AllowsFiche(AgentIdsOf(m), fiche.EcoleId, missionIds, fiche.MissionId);
    }

    // ——— Décisions ———

    /// <summary>Affiche la liste des décisions administratives.</summary>
    [RequirePageAccess("decisions")]
    public async Task<IActionResult> Decisions()
    {
        var scope = await ScopeAsync();
        ViewBag.PageKey = "decisions";
        ViewBag.CanCreerDecision = Can(AccessActions.CreerDecision);
        ViewBag.TypesDecision = DecisionTypes.Labels;
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var decisions = await _decisions.QueryEntitiesAsync();
        if (!scope.Unrestricted)
        {
            ecoles = ecoles.Where(e => scope.AllowsEcole(e.Id)).ToList();
            fiches = fiches.Where(f => scope.AllowsEcole(f.EcoleId)).ToList();
            decisions = decisions.Where(d => scope.AllowsDecision(d.EcoleId)).ToList();
        }
        ViewBag.Ecoles = ecoles;
        ViewBag.Fiches = fiches;
        ViewBag.Produits = await _parametres.QueryEntitiesAsync(RefCategories.Produits);
        ViewBag.Outils = await _parametres.QueryEntitiesAsync(RefCategories.Outils);
        ViewBag.FichesSansDecision = Can(AccessActions.CreerDecision)
            ? await _decisions.QueryFichesSansDecisionAsync()
            : new List<FicheControle>();
        return View(decisions);
    }

    /// <summary>Retourne les décisions et fiches sans décision en JSON.</summary>
    [RequirePageAccess("decisions"), HttpGet]
    public async Task<IActionResult> GetDecisions()
    {
        var scope = await ScopeAsync();
        var decisions = await _decisions.ListAsync();
        var sans = Can(AccessActions.CreerDecision)
            ? await _decisions.FichesSansDecisionAsync()
            : Array.Empty<FicheListDto>();
        if (!scope.Unrestricted)
        {
            decisions = decisions.Where(d => scope.AllowsDecision(d.EcoleId)).ToList();
            sans = sans.Where(f => scope.AllowsEcole(f.EcoleId)).ToList();
        }
        return Json(new { decisions, sansDecision = sans });
    }

    /// <summary>Enregistre une décision via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> SaveDecision(Decision model)
    {
        if (DenyPage(AccessActions.CreerDecision) is { } denied) return denied;
        TempData["Toast"] = (await _decisions.SaveAsync(new SaveDecisionDto
        {
            Id = model.Id,
            FicheControleId = model.FicheControleId,
            EcoleId = model.EcoleId,
            TypeDecision = model.TypeDecision
        }, UserId)).Message;
        return RedirectToAction(nameof(Decisions));
    }

    /// <summary>Enregistre une décision via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> SaveDecisionJson([FromBody] SaveDecisionDto dto)
    {
        if (TryDenyJson(AccessActions.CreerDecision, out var denied)) return denied;
        return Json(await _decisions.SaveAsync(dto, UserId));
    }

    /// <summary>Supprime une décision via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> DeleteDecision(string id)
    {
        if (DenyPage(AccessActions.CreerDecision) is { } denied) return denied;
        TempData["Toast"] = (await _decisions.DeleteAsync(id)).Message;
        return RedirectToAction(nameof(Decisions));
    }

    /// <summary>Supprime une décision via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> DeleteDecisionJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerDecision, out var denied)) return denied;
        return Json(await _decisions.DeleteAsync(dto.Id));
    }

    /// <summary>Génère le PDF de la lettre de décision et l'envoie au chef d'établissement.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("decisions")]
    public async Task<IActionResult> EnvoyerLettreDecisionJson([FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.CreerDecision, out var denied)) return denied;
        return Json(await _decisions.EnvoyerLettreParMailAsync(dto.Id, UserId));
    }

    // ——— Statistiques ———

    /// <summary>Affiche le tableau de bord statistiques.</summary>
    [RequirePageAccess("statistiques")]
    public async Task<IActionResult> Statistiques()
    {
        var (sousproveds, regimes) = await _ecoles.GetLookupsAsync();
        var ecoles = await _ecoles.QueryEntitiesAsync(new EcoleFilterDto());
        var fiches = await _fiches.QueryEntitiesAsync(new FicheFilterDto());
        var decisions = await _decisions.QueryEntitiesAsync();
        ViewBag.PageKey = "statistiques";
        ViewBag.Sousproveds = sousproveds;
        ViewBag.Regimes = regimes;
        ViewBag.EcolesJson = ecoles.Select(e => new
        {
            id = e.Id,
            regime = RegGes.LabelOf(e.RegGes),
            sousproved = SousDivision.LabelOf(e.SousDivision)
        }).ToList();
        ViewBag.FichesJson = fiches.Select(f => new
        {
            id = f.Id,
            ecoleId = f.EcoleId,
            createdAt = f.CreatedAt,
            etatGeneral = f.EtatGeneral,
            produitsCount = f.ControleProduits?.Count ?? 0,
            hasAutres = !string.IsNullOrWhiteSpace(f.ProduitsAutres)
        }).ToList();
        ViewBag.DecisionsJson = decisions.Select(d => new
        {
            id = d.NumDecision,
            ecoleId = d.Ecole?.Id ?? "",
            type = DecisionTypes.LabelOf(d.DecisionFin),
            decideLe = (DateTime?)null,
            createdAt = (DateTime?)null
        }).ToList();
        return View();
    }

    /// <summary>Retourne les statistiques agrégées en JSON.</summary>
    [RequirePageAccess("statistiques"), HttpGet]
    public async Task<IActionResult> GetStatistiques([FromQuery] StatistiquesFilterDto filter)
        => Json(await _statistiques.GetAsync(filter));

    /// <summary>Exporte les statistiques au format CSV.</summary>
    [RequirePageAccess("statistiques"), HttpGet]
    public async Task<IActionResult> ExportStatistiquesCsv([FromQuery] StatistiquesFilterDto filter)
    {
        var csv = await _statistiques.ExportCsvAsync(filter);
        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "statistiques-inspect-san.csv");
    }

    // ——— Rapport d'inspection ———

    /// <summary>Affiche la page du rapport d'inspection.</summary>
    [RequirePageAccess("rapport")]
    public async Task<IActionResult> Rapport()
    {
        var (sousproveds, _) = await _ecoles.GetLookupsAsync();
        ViewBag.PageKey = "rapport";
        ViewBag.Sousproveds = sousproveds;
        ViewBag.Role = Role;
        ViewBag.CanDeposerEquipe = string.Equals(Role, DataScope.RoleControleur, StringComparison.Ordinal);
        ViewBag.CanDeposerSecretariat = false;
        ViewBag.CanCloturer = false;
        return View();
    }

    /// <summary>Retourne les données du rapport d'inspection en JSON.</summary>
    [RequirePageAccess("rapport"), HttpGet]
    public async Task<IActionResult> GetRapportInspection([FromQuery] RapportInspectionFilterDto filter)
    {
        var scope = await ScopeAsync();
        return Json(await _statistiques.GetRapportInspectionAsync(filter, Role, scope.AgentId));
    }

    /// <summary>Dépose le rapport d'équipe au secrétariat.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapport")]
    public async Task<IActionResult> DeposerRapportEquipeJson([FromBody] SousDivisionCodeRequest dto)
    {
        if (!string.Equals(Role, DataScope.RoleControleur, StringComparison.Ordinal))
            return Json(ApiResultDto.Fail("Seul le chef d'équipe (contrôleur) peut déposer le rapport au secrétariat."));
        var scope = await ScopeAsync();
        return Json(await _statistiques.DeposerRapportEquipeAsync(dto.SousDivisionCode, UserId, scope.AgentId));
    }

    /// <summary>Transfère le rapport au Directeur Provincial (après dépôt équipe).</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapport")]
    public async Task<IActionResult> DeposerRapportSecretariatJson([FromBody] SousDivisionCodeRequest dto)
    {
        if (!string.Equals(Role, DataScope.RoleDp, StringComparison.Ordinal)
            && !string.Equals(Role, DataScope.RoleAdmin, StringComparison.Ordinal))
            return Json(ApiResultDto.Fail("Seul le Directeur Provincial (ou admin) peut enregistrer le transfert du rapport."));
        return Json(await _statistiques.DeposerRapportSecretariatAsync(dto.SousDivisionCode, UserId));
    }

    /// <summary>Clôture le rapport d'inspection pour une sous-division.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("rapport")]
    public async Task<IActionResult> CloturerRapportJson([FromBody] SousDivisionCodeRequest dto)
    {
        var isAdmin = string.Equals(Role, DataScope.RoleAdmin, StringComparison.Ordinal);
        if (!string.Equals(Role, DataScope.RoleDp, StringComparison.Ordinal) && !isAdmin)
            return Json(ApiResultDto.Fail("Seul le Directeur Provincial (ou admin) peut clôturer."));
        return Json(await _statistiques.CloturerRapportAsync(dto.SousDivisionCode, UserId, forceAdmin: isAdmin));
    }
    // ——— Paramètres ———

    /// <summary>Affiche la gestion des paramètres de référence.</summary>
    [RequirePageAccess("parametres")]
    public async Task<IActionResult> Parametres(string tab = "categories")
    {
        ViewBag.PageKey = "parametres";
        ViewBag.Tab = tab;
        ViewBag.CanGererParametres = Can(AccessActions.GererParametres);
        ViewBag.Items = await _parametres.QueryEntitiesAsync(tab);
        return View();
    }

    /// <summary>Retourne les paramètres de référence en JSON.</summary>
    [RequirePageAccess("parametres"), HttpGet]
    public async Task<IActionResult> GetParametres(string tab = "categories")
        => Json(await _parametres.ListAsync(tab));

    /// <summary>Enregistre un paramètre via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> SaveParametre(string tab, RefItem model)
    {
        if (DenyPage(AccessActions.GererParametres) is { } denied) return denied;
        TempData["Toast"] = (await _parametres.SaveAsync(tab, new SaveRefItemDto
        {
            Nom = model.Nom,
            Code = int.TryParse(model.Code, out var code) ? code : 0,
            CodeText = string.IsNullOrWhiteSpace(model.Code) || int.TryParse(model.Code, out _)
                ? Request.Form["CodeText"].ToString()
                : model.Code,
            Libelle = model.Libelle
        })).Message;
        return RedirectToAction(nameof(Parametres), new { tab });
    }

    /// <summary>Enregistre un paramètre via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> SaveParametreJson(string tab, [FromBody] SaveRefItemDto dto)
    {
        if (TryDenyJson(AccessActions.GererParametres, out var denied)) return denied;
        return Json(await _parametres.SaveAsync(tab, dto));
    }

    /// <summary>Supprime un paramètre via formulaire et redirige.</summary>
    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> DeleteParametre(string tab, string id)
    {
        if (DenyPage(AccessActions.GererParametres) is { } denied) return denied;
        TempData["Toast"] = (await _parametres.DeleteAsync(tab, id)).Message;
        return RedirectToAction(nameof(Parametres), new { tab });
    }

    /// <summary>Supprime un paramètre via API JSON.</summary>
    [HttpPost, IgnoreAntiforgeryToken, RequirePageAccess("parametres")]
    public async Task<IActionResult> DeleteParametreJson(string tab, [FromBody] IdRequest dto)
    {
        if (TryDenyJson(AccessActions.GererParametres, out var denied)) return denied;
        return Json(await _parametres.DeleteAsync(tab, dto.Id));
    }

    /// <summary>
    /// Test SMTP temporaire (admin uniquement) : GET /Home/TestEmail?to=adresse@exemple.com
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> TestEmail(string? to, CancellationToken ct)
    {
        if (!string.Equals(Role, DataScope.RoleAdmin, StringComparison.Ordinal))
            return DenyScopeJson();

        if (string.IsNullOrWhiteSpace(to))
            return Json(ApiResultDto.Fail("Paramètre requis : ?to=adresse@exemple.com"));

        var (ok, detail) = await _emailSender.TrySendAsync(
            to.Trim(),
            "Inspect-San SMTP OK",
            "<p><strong>Inspect-San SMTP OK</strong></p><p>Ceci est un e-mail de test (sans PDF).</p>",
            ct);

        return Json(ok
            ? ApiResultDto.Ok(detail)
            : ApiResultDto.Fail(detail));
    }

    // ——— Journal ———

    /// <summary>Affiche le journal d'audit filtrable.</summary>
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

    /// <summary>Retourne les entrées du journal en JSON.</summary>
    [RequirePageAccess("journal"), HttpGet]
    public async Task<IActionResult> GetJournal([FromQuery] JournalFilterDto filter)
        => Json(await _journal.ListAsync(filter));

    // ——— Notifications ———

    /// <summary>Marque une notification comme lue via formulaire.</summary>
    [Authorize, HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkNotificationRead(string id)
    {
        await _notifications.MarkReadAsync(id, UserId);
        return Redirect(Request.Headers.Referer.ToString().Length > 0 ? Request.Headers.Referer.ToString()! : "/");
    }

    /// <summary>Marque une notification comme lue via API JSON.</summary>
    [Authorize, HttpPost, IgnoreAntiforgeryToken]
    public async Task<IActionResult> MarkNotificationReadJson([FromBody] IdRequest dto)
        => Json(await _notifications.MarkReadAsync(dto.Id, UserId));

    /// <summary>Marque toutes les notifications comme lues via formulaire.</summary>
    [Authorize, HttpPost, ValidateAntiForgeryToken]
    public async Task<IActionResult> MarkAllNotificationsRead()
    {
        TempData["Toast"] = (await _notifications.MarkAllReadAsync(UserId)).Message;
        return Redirect(Request.Headers.Referer.ToString().Length > 0 ? Request.Headers.Referer.ToString()! : "/");
    }

    /// <summary>Marque toutes les notifications comme lues via API JSON.</summary>
    [Authorize, HttpPost, IgnoreAntiforgeryToken]
    public async Task<IActionResult> MarkAllNotificationsReadJson()
        => Json(await _notifications.MarkAllReadAsync(UserId));
}

/// <summary>Corps JSON minimal portant un identifiant.</summary>
public class IdRequest
{
    public string Id { get; set; } = "";
}

/// <summary>Corps JSON pour changer le statut d'un utilisateur.</summary>
public class SetStatutRequest
{
    public string Id { get; set; } = "";
    public string Statut { get; set; } = "";
}
