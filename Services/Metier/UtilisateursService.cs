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

/// <summary>Gestion des comptes utilisateurs et du profil.</summary>
public class UtilisateursService : IUtilisateursService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _store;

    /// <summary>Initialise le service utilisateurs avec Identity et EF.</summary>
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

    /// <summary>Retourne les entités utilisateur.</summary>
    public async Task<List<Utilisateur>> QueryEntitiesAsync()
    {
        var users = await _userManager.Users.AsNoTracking().OrderBy(u => u.Nom).ToListAsync();
        return users.Select(ToUtilisateur).ToList();
    }

    /// <summary>Liste les utilisateurs sous forme de DTO.</summary>
    public async Task<IReadOnlyList<UtilisateurListDto>> ListAsync()
    {
        var users = await _userManager.Users.AsNoTracking().OrderBy(u => u.Nom).ToListAsync();
        var agentIds = users.Where(u => u.AgentId != null).Select(u => u.AgentId!).Distinct().ToList();
        var agentNoms = await _db.Agents.AsNoTracking()
            .Where(a => agentIds.Contains(a.MatrAgent))
            .ToDictionaryAsync(a => a.MatrAgent, a => a.NomAgent);

        return users.Select(u => new UtilisateurListDto
        {
            Id = u.Id,
            Nom = u.Nom,
            Contact = u.Email ?? "",
            Role = u.Role,
            AgentId = u.AgentId,
            AgentNom = u.AgentId != null ? agentNoms.GetValueOrDefault(u.AgentId) : null,
            Statut = u.Statut,
            Identifiant = u.Email ?? u.UserName ?? "",
            Telephone = u.Telephone,
            EcoleId = u.EcoleId
        }).ToList();
    }

    /// <summary>Liste les agents sans compte utilisateur associé.</summary>
    public async Task<IReadOnlyList<AgentSansCompteDto>> ListAgentsSansCompteAsync(string? excludeUserId = null)
    {
        var linkedAgentIds = await _userManager.Users.AsNoTracking()
            .Where(u => u.AgentId != null && (excludeUserId == null || u.Id != excludeUserId))
            .Select(u => u.AgentId!)
            .ToListAsync();

        return await _db.Agents.AsNoTracking()
            .Where(a => !linkedAgentIds.Contains(a.MatrAgent))
            .OrderBy(a => a.NomAgent)
            .Select(a => new AgentSansCompteDto
            {
                AgentId = a.MatrAgent,
                NomComplet = a.NomAgent
            })
            .ToListAsync();
    }

    /// <summary>Compat : délègue à CreateAsync ; refuse si Id présent.</summary>
    public Task<ApiResultDto> SaveAsync(SaveUtilisateurDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Id))
            return Task.FromResult(ApiResultDto.Fail(
                "Modification admin interdite. L’utilisateur met à jour son profil ; l’admin active ou désactive le compte."));
        return CreateAsync(dto);
    }

    /// <summary>Création admin uniquement. Refuse toute mise à jour (Id renseigné).</summary>
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

        if (dto.Role == DataScope.RoleChef || dto.Role == "Chef d'établissement")
            return ApiResultDto.Fail("Le rôle « Chef d'établissement » n'est plus un compte de connexion.");

        if (!AccessControl.RoleAccess.ContainsKey(dto.Role))
            return ApiResultDto.Fail("Rôle invalide.");

        var pwd = dto.MotDePasse?.Trim() ?? "";
        var pwd2 = dto.ConfirmationMotDePasse?.Trim() ?? "";
        if (string.IsNullOrWhiteSpace(pwd))
            return ApiResultDto.Fail("Le mot de passe est obligatoire.");
        if (pwd != pwd2)
            return ApiResultDto.Fail("Les mots de passe ne correspondent pas.");

        var ecoleId = (string?)null;

        string? agentId = null;

        if (dto.Role == "Contrôleur")
        {
            if (string.IsNullOrWhiteSpace(dto.AgentId))
                return ApiResultDto.Fail("Un agent doit être sélectionné.");

            var agent = await _db.Agents.AsNoTracking()
                .FirstOrDefaultAsync(a => a.MatrAgent == dto.AgentId);
            if (agent == null)
                return ApiResultDto.Fail("Agent invalide ou inactif.");

            var otherUser = await _userManager.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.AgentId == agent.MatrAgent);
            if (otherUser != null)
                return ApiResultDto.Fail("Cet agent a déjà un compte.");

            agentId = agent.MatrAgent;
            if (string.IsNullOrWhiteSpace(dto.Nom))
                dto.Nom = agent.NomAgent;
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
            AgentId = agentId,
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

    /// <summary>Active ou désactive un compte utilisateur.</summary>
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

    /// <summary>Charge le profil de l'utilisateur connecté.</summary>
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

        string? agentNom = null;
        if (!string.IsNullOrWhiteSpace(user.AgentId))
        {
            agentNom = await _db.Agents.AsNoTracking()
                .Where(a => a.MatrAgent == user.AgentId)
                .Select(a => a.NomAgent)
                .FirstOrDefaultAsync();
        }

        return new ProfilDto
        {
            Id = user.Id,
            Nom = user.Nom,
            Contact = user.Email ?? "",
            Telephone = user.Telephone,
            Role = user.Role,
            AgentId = user.AgentId,
            AgentNom = agentNom,
            EcoleId = user.EcoleId,
            EcoleNom = ecoleNom,
            Statut = user.Statut
        };
    }

    /// <summary>Met à jour le profil de l'utilisateur connecté.</summary>
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

    /// <summary>Mappe un ApplicationUser vers l'entité Utilisateur.</summary>
    private static Utilisateur ToUtilisateur(ApplicationUser u) => new()
    {
        Id = u.Id,
        Nom = u.Nom,
        Contact = u.Email ?? "",
        Role = u.Role,
        AgentId = u.AgentId,
        Statut = u.Statut,
        Identifiant = u.Email ?? u.UserName ?? "",
        MotDePasse = "",
        Telephone = u.Telephone,
        EcoleId = u.EcoleId,
        CreatedAt = u.CreatedAt
    };
}
