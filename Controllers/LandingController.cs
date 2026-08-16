using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using inspect_san.Services;

namespace inspect_san.Controllers;

/// <summary>
/// Entrée publique. Anonyme → landing ; authentifié → espace métier (DefaultLanding).
/// </summary>
[AllowAnonymous]
public class LandingController : Controller
{
    [HttpGet]
    public IActionResult Index()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var (controller, action) = AccessControl.DefaultLanding(role);
            return RedirectToAction(action, controller);
        }

        return View();
    }
}
