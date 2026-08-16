using System.Security.Claims;
using inspect_san.Filters;
using inspect_san.Interface;
using inspect_san.Models.Identity;
using inspect_san.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace inspect_san.Controllers;

/// <summary>
/// Portail unique réservé au Chef d’établissement (strict — pas d’admin).
/// ValiderFiche reste disponible ici pour ne pas dépendre de la page fiches.
/// </summary>
[Authorize]
public class ChefEtablissementController : Controller
{
    private readonly IChefEspaceService _espace;
    private readonly IFichesControleService _fiches;
    private readonly UserManager<ApplicationUser> _users;

    public ChefEtablissementController(
        IChefEspaceService espace,
        IFichesControleService fiches,
        UserManager<ApplicationUser> users)
    {
        _espace = espace;
        _fiches = fiches;
        _users = users;
    }

    private string Role => User.FindFirstValue(ClaimTypes.Role) ?? "";
    private string UserId => User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "";

    [RequirePageAccess("espace-chef")]
    public async Task<IActionResult> Index()
    {
        ViewBag.PageKey = "espace-chef";
        var user = await _users.FindByIdAsync(UserId);
        var ecoleId = user?.EcoleId;
        var canValider = AccessControl.CanDo(Role, AccessActions.ValiderFiche);
        var vm = await _espace.GetEspaceAsync(ecoleId, canValider);
        return View(vm);
    }

    [HttpPost, ValidateAntiForgeryToken, RequirePageAccess("espace-chef")]
    public async Task<IActionResult> ValiderFiche(string id)
    {
        if (!AccessControl.CanDo(Role, AccessActions.ValiderFiche))
            return Forbid();

        var user = await _users.FindByIdAsync(UserId);
        var ecoleId = user?.EcoleId;
        if (string.IsNullOrWhiteSpace(ecoleId))
        {
            TempData["Toast"] = "Aucun établissement lié.";
            TempData["ToastType"] = "danger";
            return RedirectToAction(nameof(Index));
        }

        var fiche = (await _fiches.QueryEntitiesAsync(new Models.DTOs.FicheFilterDto()))
            .FirstOrDefault(f => f.Id == id);
        if (fiche == null || !string.Equals(fiche.EcoleId, ecoleId, StringComparison.Ordinal))
        {
            TempData["Toast"] = "Fiche hors périmètre.";
            TempData["ToastType"] = "danger";
            return RedirectToAction(nameof(Index));
        }

        TempData["Toast"] = (await _fiches.ValiderAsync(id, UserId)).Message;
        return RedirectToAction(nameof(Index));
    }
}
