using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using inspect_san.Interface;
using inspect_san.Models.DTOs;
using inspect_san.Models.Identity;
using inspect_san.Services;
using inspect_san.Services.Mock;
using inspect_san.ViewModels;

namespace inspect_san.Controllers;

/// <summary>Contrôleur d'authentification Identity (connexion, mot de passe, profil).</summary>
public class AuthController : Controller
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly MockUserStore _store;
    private readonly IAppEmailSender _email;
    private readonly IUtilisateursService _utilisateurs;

    /// <summary>Injecte les services Identity, e-mail et utilisateurs.</summary>
    public AuthController(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        MockUserStore store,
        IAppEmailSender email,
        IUtilisateursService utilisateurs)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _store = store;
        _email = email;
        _utilisateurs = utilisateurs;
    }

    /// <summary>Redirige vers returnUrl local ou l'espace métier du rôle.</summary>
    private IActionResult RedirectAfterAuth(ApplicationUser user, string? returnUrl = null)
    {
        if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            return Redirect(returnUrl);
        var (controller, action) = AccessControl.DefaultLanding(user.Role);
        return RedirectToAction(action, controller);
    }

    /// <summary>Affiche le formulaire de connexion ou authentifie l'utilisateur.</summary>
    [AllowAnonymous]
    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var (controller, action) = AccessControl.DefaultLanding(role);
            return RedirectToAction(action, controller);
        }
        return View(new LoginViewModel { ReturnUrl = returnUrl });
    }

    /// <summary>Affiche le formulaire de connexion ou authentifie l'utilisateur.</summary>
    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var email = model.Email.Trim();
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !string.Equals(user.Statut, "actif", StringComparison.OrdinalIgnoreCase))
        {
            model.Error = "E-mail ou mot de passe incorrect, ou compte inactif.";
            return View(model);
        }

        var result = await _signInManager.PasswordSignInAsync(
            user, model.MotDePasse, isPersistent: true, lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            model.Error = "E-mail ou mot de passe incorrect, ou compte inactif.";
            return View(model);
        }

        _store.AddJournal("Authentification", "connexion", $"Connexion de {user.Nom}", user.Id);

        return RedirectAfterAuth(user, model.ReturnUrl);
    }

    /// <summary>Affiche ou traite la demande de réinitialisation du mot de passe.</summary>
    [AllowAnonymous]
    [HttpGet]
    public IActionResult ForgotPassword() => View(new ForgotPasswordViewModel());

    /// <summary>Affiche ou traite la demande de réinitialisation du mot de passe.</summary>
    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
    {
        const string generic = "Si un compte correspond à cet e-mail, un lien de réinitialisation a été envoyé.";
        if (!ModelState.IsValid)
        {
            model.Info = generic;
            return View(model);
        }

        var user = await _userManager.FindByEmailAsync(model.Email.Trim());
        if (user != null && string.Equals(user.Statut, "actif", StringComparison.OrdinalIgnoreCase))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var link = Url.Action(
                nameof(ResetPassword),
                "Auth",
                new { email = user.Email, token = encoded },
                protocol: Request.Scheme)!;

            await _email.SendAsync(
                user.Email!,
                "Réinitialisation mot de passe — Inspect-San",
                $"<p>Bonjour {HtmlEncoder.Default.Encode(user.Nom)},</p>" +
                $"<p>Cliquez pour réinitialiser votre mot de passe :</p>" +
                $"<p><a href=\"{HtmlEncoder.Default.Encode(link)}\">Réinitialiser</a></p>" +
                $"<p>Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>");
        }

        model.Info = generic;
        return View(model);
    }

    /// <summary>Affiche ou applique le nouveau mot de passe via le jeton.</summary>
    [AllowAnonymous]
    [HttpGet]
    public IActionResult ResetPassword(string email, string token)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token))
            return RedirectToAction(nameof(Login));
        return View(new ResetPasswordViewModel { Email = email, Token = token });
    }

    /// <summary>Affiche ou applique le nouveau mot de passe via le jeton.</summary>
    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
    {
        if (!ModelState.IsValid)
            return View(model);

        var user = await _userManager.FindByEmailAsync(model.Email.Trim());
        if (user == null)
        {
            model.Error = "Lien invalide ou expiré.";
            return View(model);
        }

        string decoded;
        try
        {
            decoded = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(model.Token));
        }
        catch
        {
            model.Error = "Lien invalide ou expiré.";
            return View(model);
        }

        var result = await _userManager.ResetPasswordAsync(user, decoded, model.MotDePasse);
        if (!result.Succeeded)
        {
            model.Error = string.Join(" ", result.Errors.Select(e => e.Description));
            return View(model);
        }

        _store.AddJournal("Authentification", "reset password", $"Mot de passe réinitialisé pour {user.Nom}", user.Id);
        TempData["Toast"] = "Mot de passe mis à jour. Vous pouvez vous connecter.";
        TempData["ToastType"] = "success";
        return RedirectToAction(nameof(Login));
    }

    /// <summary>Déconnecte l'utilisateur et journalise l'événement.</summary>
    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        var nom = User.Identity?.Name;
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _store.AddJournal("Authentification", "déconnexion", $"Déconnexion de {nom}", id);
        await _signInManager.SignOutAsync();
        return RedirectToAction(nameof(Login));
    }

    /// <summary>Page Accès refusé (Identity AccessDeniedPath).</summary>
    [AllowAnonymous]
    [HttpGet]
    public IActionResult AccessDenied()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var (controller, action) = AccessControl.DefaultLanding(role);
            ViewBag.EspaceUrl = Url.Action(action, controller) ?? "/";
            ViewBag.EspaceLabel = "Retour à mon espace";
        }
        else
        {
            ViewBag.EspaceUrl = Url.Action(nameof(Login)) ?? "/Auth/Login";
            ViewBag.EspaceLabel = "Se connecter";
        }

        return View();
    }

    /// <summary>Profil self-service — /Auth/Profil (tous rôles authentifiés).</summary>
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> Profil()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return RedirectToAction(nameof(Login));

        var profil = await _utilisateurs.GetProfilAsync(userId);
        if (profil == null)
            return RedirectToAction(nameof(Login));

        return View(ToProfilVm(profil));
    }

    /// <summary>Affiche ou met à jour le profil self-service de l'utilisateur courant.</summary>
    [Authorize]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Profil(ProfilViewModel model)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return RedirectToAction(nameof(Login));

        // Jamais d'autre userId : on ignore model.Id et on force le compte courant.
        model.Id = userId;

        var current = await _utilisateurs.GetProfilAsync(userId);
        if (current == null)
            return RedirectToAction(nameof(Login));

        model.Role = current.Role;
        model.AgentNom = current.AgentNom;
        model.EcoleNom = current.EcoleNom;

        if (!ModelState.IsValid)
            return View(model);

        var result = await _utilisateurs.UpdateProfilAsync(userId, new UpdateProfilDto
        {
            Nom = model.Nom,
            Contact = model.Contact,
            Telephone = model.Telephone,
            MotDePasseActuel = model.MotDePasseActuel,
            NouveauMotDePasse = model.NouveauMotDePasse,
            ConfirmationMotDePasse = model.ConfirmationMotDePasse
        });

        if (!result.Success)
        {
            model.Error = result.Message;
            return View(model);
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user != null)
            await _signInManager.RefreshSignInAsync(user);

        TempData["Toast"] = result.Message;
        TempData["ToastType"] = "success";
        return RedirectToAction(nameof(Profil));
    }

    /// <summary>Mappe un ProfilDto vers le ViewModel de profil.</summary>
    private static ProfilViewModel ToProfilVm(ProfilDto p) => new()
    {
        Id = p.Id,
        Nom = p.Nom,
        Contact = p.Contact,
        Telephone = p.Telephone,
        Role = p.Role,
        AgentNom = p.AgentNom,
        EcoleNom = p.EcoleNom
    };
}
