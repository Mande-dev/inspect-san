using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using inspect_san.Models.DTOs;
using inspect_san.Services;

namespace inspect_san.Filters;

/// <summary>
/// Vérifie que le rôle courant peut accéder à la page (comme canAccess côté Vite).
/// Hors périmètre RBAC page :
/// - requêtes JSON / AJAX → 403 JSON (évite HTML redirect cassant le client fetch)
/// - navigations classiques → redirect vers <see cref="AccessControl.DefaultLanding"/>
/// </summary>
public class RequirePageAccessAttribute : ActionFilterAttribute
{
    private readonly string _pageKey;

    public RequirePageAccessAttribute(string pageKey) => _pageKey = pageKey;

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var role = context.HttpContext.User.FindFirstValue(ClaimTypes.Role);
        if (!AccessControl.CanAccess(role, _pageKey))
        {
            if (WantsJson(context))
            {
                context.Result = new JsonResult(ApiResultDto.Fail("Accès refusé pour votre rôle."))
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };
                return;
            }

            var (controller, action) = AccessControl.DefaultLanding(role);
            context.Result = new RedirectToActionResult(action, controller, null);
            return;
        }
        base.OnActionExecuting(context);
    }

    private static bool WantsJson(ActionExecutingContext context)
    {
        var action = context.RouteData.Values["action"]?.ToString() ?? "";
        if (action.EndsWith("Json", StringComparison.OrdinalIgnoreCase))
            return true;

        var accept = context.HttpContext.Request.Headers.Accept.ToString();
        if (accept.Contains("application/json", StringComparison.OrdinalIgnoreCase))
            return true;

        var requestedWith = context.HttpContext.Request.Headers.XRequestedWith.ToString();
        if (string.Equals(requestedWith, "XMLHttpRequest", StringComparison.OrdinalIgnoreCase))
            return true;

        var contentType = context.HttpContext.Request.ContentType ?? "";
        return contentType.Contains("application/json", StringComparison.OrdinalIgnoreCase);
    }
}
