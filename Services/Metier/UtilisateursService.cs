using inspect_san.Interface;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using inspect_san.Services;
using inspect_san.Services.Mock;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class UtilisateursService : IUtilisateursService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _store;

    public UtilisateursService(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        InspectSanDbContext db,
        MockUserStore store)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _db = db;
        _store = store;
    }

    public async Task<List<Utilisateur>> QueryEntitiesAsync()
    {
        var users = await _userManager.Users.AsNoTracking().OrderBy(u => u.Nom).ToListAsync();
        return users.Select(ToUtilisateur).ToList();
    }

    public async Task<IReadOnlyList<UtilisateurListDto>> ListAsync()
    {
        var users = await _userManager.Users.AsNoTracking().OrderBy(u => u.Nom).ToListAsync();
        return users.Select(u => new UtilisateurListDto
        {
            Id = u.Id,
            Nom = u.Nom,
            Contact = u.Email ?? "",
            Role = u.Role,
            Equipe = u.Equipe,
            EquipeId = u.EquipeId,
            ControleurId = u.ControleurId,
            Statut = u.Statut,
            Identifiant = u.Email ?? u.UserName ?? "",
            Telephone = u.Telephone,
            EcoleId = u.EcoleId
        }).ToList();
    }

    public async Task<IReadOnlyList<ChefEquipeSansCompteDto>> ListChefsEquipeSansCompteAsync(string? excludeUserId = null)
    {
        var linkedChefIds = await _userManager.Users.AsNoTracking()
            .Where(u => u.ControleurId != null && (excludeUserId == null || u.Id != excludeUserId))
            .Select(u => u.ControleurId!)
            .ToListAsync();

        var equipesAvecCompte = await _userManager.Users.AsNoTracking()
            .Where(u => u.Role == "Contrôleur" && u.EquipeId != null && (excludeUserId == null || u.Id != excludeUserId))
            .Select(u => u.EquipeId!)
            .ToListAsync();

        return await _db.Equipes.AsNoTracking()
            .Where(e => e.ChefControleurId != null
                        && !linkedChefIds.Contains(e.ChefControleurId)
                        && !equipesAvecCompte.Contains(e.Id))
            .Join(_db.Controleurs.AsNoTracking(),
                e => e.ChefControleurId,
                c => c.Id,
                (e, c) => new ChefEquipeSansCompteDto
                {
                    ControleurId = c.Id,
                    NomComplet = c.NomComplet,
                    EquipeId = e.Id,
                    EquipeNom = e.Nom
                })
            .OrderBy(x => x.EquipeNom)
            .ThenBy(x => x.NomComplet)
            .ToListAsync();
    }

    public Task<ApiResultDto> SaveAsync(SaveUtilisateurDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Id))
            return Task.FromResult(ApiResultDto.Fail(
                "Modification admin interdite. L’utilisateur met à jour son profil ; l’admin active ou désactive le compte."));
        return CreateAsync(dto);
    }

    public async Task<ApiResultDto> CreateAsync(SaveUtilisateurDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Id))
            return ApiResultDto.Fail(
                "Modification admin interdite. L’utilisateur met à jour son profil ; l’admin active ou désactive le compte.");

        if (string.IsNullOrWhiteSpace(dto.Nom))
            return ApiResultDto.Fail("Le nom complet est obligatoire.");

        var email = (dto.Contact ?? "").Trim();
        if (string.IsNullOrWhiteSpace(email))
            return ApiResultDto.Fail("L'adresse e-mail est obligatoire.");
        if (!email.Contains('@'))
            return ApiResultDto.Fail("Adresse e-mail invalide.");

        if (!AccessControl.RoleAccess.ContainsKey(dto.Role))
            return ApiResultDto.Fail("Rôle invalide.");

        var pwd = dto.MotDePasse?.Trim() ?? "";
        var pwd2 = dto.ConfirmationMotDePasse?.Trim() ?? "";
        if (string.IsNullOrWhiteSpace(pwd))
            return ApiResultDto.Fail("Le mot de passe est obligatoire.");
        if (pwd != pwd2)
            return ApiResultDto.Fail("Les mots de passe ne correspondent pas.");

        var ecoleId = dto.Role == "Chef d'établissement" ? dto.EcoleId : null;
        if (dto.Role == "Chef d'établissement" && string.IsNullOrWhiteSpace(ecoleId))
            return ApiResultDto.Fail("Une école doit être liée au Chef d'établissement.");

        string? equipeId = null;
        string? equipeLabel = null;
        string? controleurId = null;

        if (dto.Role == "Contrôleur")
        {
            if (string.IsNullOrWhiteSpace(dto.ControleurId))
                return ApiResultDto.Fail("Un chef d’équipe doit être sélectionné.");

            var chef = await _db.Controleurs.AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == dto.ControleurId);
            if (chef == null)
                return ApiResultDto.Fail("Chef d’équipe invalide.");

            var equipe = await _db.Equipes.AsNoTracking()
                .FirstOrDefaultAsync(e => e.ChefControleurId == chef.Id);
            if (equipe == null)
                return ApiResultDto.Fail("Ce contrôleur n’est pas chef d’équipe.");

            var otherUser = await _userManager.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.ControleurId == chef.Id);
            if (otherUser != null)
                return ApiResultDto.Fail("Ce chef d’équipe a déjà un compte.");

            var otherEquipeUser = await _userManager.Users.AsNoTracking()
                .FirstOrDefaultAsync(u =>
                    u.Role == "Contrôleur" && u.EquipeId == equipe.Id);
            if (otherEquipeUser != null)
                return ApiResultDto.Fail("Cette équipe a déjà un compte Contrôleur.");

            equipeId = equipe.Id;
            equipeLabel = equipe.Nom;
            controleurId = chef.Id;

            if (string.IsNullOrWhiteSpace(dto.Nom))
                dto.Nom = chef.NomComplet;
        }

        var byEmail = await _userManager.FindByEmailAsync(email);
        var byName = await _userManager.FindByNameAsync(email);
        if (byEmail != null || byName != null)
            return ApiResultDto.Fail("Cet e-mail est déjà utilisé.");

        var statut = string.Equals(dto.Statut, "inactif", StringComparison.OrdinalIgnoreCase)
            ? "inactif"
            : "actif";

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            Nom = dto.Nom.Trim(),
            Role = dto.Role,
            Equipe = equipeLabel,
            EquipeId = equipeId,
            ControleurId = controleurId,
            Statut = statut,
            Telephone = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim(),
            EcoleId = ecoleId,
            CreatedAt = DateTime.UtcNow
        };

        var create = await _userManager.CreateAsync(user, pwd);
        if (!create.Succeeded)
            return ApiResultDto.Fail(string.Join(" ", create.Errors.Select(e => e.Description)));

        if (!await _roleManager.RoleExistsAsync(dto.Role))
            await _roleManager.CreateAsync(new IdentityRole(dto.Role));

        await _userManager.AddToRoleAsync(user, dto.Role);
        _store.AddJournal("Utilisateurs", "création", $"Utilisateur {user.Nom} créé", user.Id);
        return ApiResultDto.Ok("Utilisateur créé.");
    }

    public async Task<ApiResultDto> SetStatutAsync(string id, string statut)
    {
        if (string.IsNullOrWhiteSpace(id))
            return ApiResultDto.Fail("Identifiant manquant.");

        var normalized = (statut ?? "").Trim().ToLowerInvariant();
        if (normalized is not ("actif" or "inactif"))
            return ApiResultDto.Fail("Statut invalide (actif ou inactif).");

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return ApiResultDto.Fail("Utilisateur introuvable.");

        if (string.Equals(user.Statut, normalized, StringComparison.OrdinalIgnoreCase))
            return ApiResultDto.Ok(normalized == "actif" ? "Compte déjà actif." : "Compte déjà inactif.");

        user.Statut = normalized;
        var update = await _userManager.UpdateAsync(user);
        if (!update.Succeeded)
            return ApiResultDto.Fail(string.Join(" ", update.Errors.Select(e => e.Description)));

        var action = normalized == "actif" ? "activation" : "désactivation";
        _store.AddJournal("Utilisateurs", action, $"Compte {user.Nom} → {normalized}", user.Id);
        return ApiResultDto.Ok(normalized == "actif" ? "Utilisateur activé." : "Utilisateur désactivé.");
    }

    public async Task<ProfilDto?> GetProfilAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        string? ecoleNom = null;
        if (!string.IsNullOrWhiteSpace(user.EcoleId))
        {
            ecoleNom = await _db.Ecoles.AsNoTracking()
                .Where(e => e.Id == user.EcoleId)
                .Select(e => e.Denomination)
                .FirstOrDefaultAsync();
        }

        return new ProfilDto
        {
            Id = user.Id,
            Nom = user.Nom,
            Contact = user.Email ?? "",
            Telephone = user.Telephone,
            Role = user.Role,
            Equipe = user.Equipe,
            EcoleId = user.EcoleId,
            EcoleNom = ecoleNom,
            Statut = user.Statut
        };
    }

    public async Task<ApiResultDto> UpdateProfilAsync(string userId, UpdateProfilDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return ApiResultDto.Fail("Utilisateur non authentifié.");

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return ApiResultDto.Fail("Utilisateur introuvable.");

        if (string.IsNullOrWhiteSpace(dto.Nom))
            return ApiResultDto.Fail("Le nom complet est obligatoire.");

        var email = (dto.Contact ?? "").Trim();
        if (string.IsNullOrWhiteSpace(email))
            return ApiResultDto.Fail("L'adresse e-mail est obligatoire.");
        if (!email.Contains('@'))
            return ApiResultDto.Fail("Adresse e-mail invalide.");

        var byEmail = await _userManager.FindByEmailAsync(email);
        if (byEmail != null && byEmail.Id != user.Id)
            return ApiResultDto.Fail("Cet e-mail est déjà utilisé.");
        var byName = await _userManager.FindByNameAsync(email);
        if (byName != null && byName.Id != user.Id)
            return ApiResultDto.Fail("Cet e-mail est déjà utilisé.");

        var newPwd = dto.NouveauMotDePasse?.Trim() ?? "";
        var newPwd2 = dto.ConfirmationMotDePasse?.Trim() ?? "";
        var currentPwd = dto.MotDePasseActuel?.Trim() ?? "";

        if (!string.IsNullOrWhiteSpace(newPwd) || !string.IsNullOrWhiteSpace(newPwd2) || !string.IsNullOrWhiteSpace(currentPwd))
        {
            if (string.IsNullOrWhiteSpace(currentPwd))
                return ApiResultDto.Fail("Saisissez votre mot de passe actuel pour le changer.");
            if (string.IsNullOrWhiteSpace(newPwd) || string.IsNullOrWhiteSpace(newPwd2))
                return ApiResultDto.Fail("Saisissez le nouveau mot de passe et sa confirmation.");
            if (newPwd != newPwd2)
                return ApiResultDto.Fail("Les mots de passe ne correspondent pas.");

            var pwdResult = await _userManager.ChangePasswordAsync(user, currentPwd, newPwd);
            if (!pwdResult.Succeeded)
                return ApiResultDto.Fail(string.Join(" ", pwdResult.Errors.Select(e => e.Description)));
        }

        user.Nom = dto.Nom.Trim();
        user.Telephone = string.IsNullOrWhiteSpace(dto.Telephone) ? null : dto.Telephone.Trim();
        user.UserName = email;
        user.NormalizedUserName = _userManager.NormalizeName(email);
        user.Email = email;
        user.NormalizedEmail = _userManager.NormalizeEmail(email);

        var update = await _userManager.UpdateAsync(user);
        if (!update.Succeeded)
            return ApiResultDto.Fail(string.Join(" ", update.Errors.Select(e => e.Description)));

        _store.AddJournal("Profil", "modification", $"Profil mis à jour ({user.Nom})", user.Id);
        return ApiResultDto.Ok("Profil mis à jour.");
    }

    private static Utilisateur ToUtilisateur(ApplicationUser u) => new()
    {
        Id = u.Id,
        Nom = u.Nom,
        Contact = u.Email ?? "",
        Role = u.Role,
        Equipe = u.Equipe,
        EquipeId = u.EquipeId,
        ControleurId = u.ControleurId,
        Statut = u.Statut,
        Identifiant = u.Email ?? u.UserName ?? "",
        MotDePasse = "",
        Telephone = u.Telephone,
        EcoleId = u.EcoleId,
        CreatedAt = u.CreatedAt
    };
}
