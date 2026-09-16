using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>CRUD des chefs d'établissement.</summary>
public class ChefsService : IChefsService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    /// <summary>Initialise le service chefs avec EF et le journal.</summary>
    public ChefsService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    /// <summary>Construit la requête chefs filtrée.</summary>
    private IQueryable<Chef> BaseQuery(ChefFilterDto filter)
    {
        var q = _db.ChefEtablissements.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(filter.Q))
        {
            var term = filter.Q.Trim().ToLower();
            q = q.Where(c => c.NomComplet.ToLower().Contains(term)
                             || c.Matricule.ToLower().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(filter.EcoleId))
        {
            var ecoleId = filter.EcoleId.Trim();
            q = q.Where(c => _db.Ecoles.Any(e => e.Id == ecoleId && e.MatriculeChef == c.Matricule));
        }
        return q;
    }

    /// <summary>Associe chaque matricule chef au nom d'établissement.</summary>
    private async Task<Dictionary<string, string>> EcoleNomsByMatriculeAsync(IEnumerable<string> matricules)
    {
        var set = matricules.ToHashSet();
        if (set.Count == 0) return new Dictionary<string, string>();
        return await _db.Ecoles.AsNoTracking()
            .Where(e => e.MatriculeChef != null && set.Contains(e.MatriculeChef))
            .GroupBy(e => e.MatriculeChef!)
            .Select(g => new { Matricule = g.Key, Nom = g.Select(x => x.Denomination).First() })
            .ToDictionaryAsync(x => x.Matricule, x => x.Nom);
    }

    /// <summary>Mappe une entité chef vers son DTO de liste.</summary>
    private static ChefListDto Map(Chef c, string? ecoleNom) => new()
    {
        Id = c.Matricule,
        NomComplet = c.NomComplet,
        Telephone = c.Telephone,
        Email = c.Email,
        EcoleNom = ecoleNom,
        AnneeDebutActivite = c.AnneeDebutActivite
    };

    /// <summary>Retourne les entités chef correspondant au filtre.</summary>
    public async Task<List<Chef>> QueryEntitiesAsync(ChefFilterDto filter)
        => await BaseQuery(filter).OrderBy(c => c.NomComplet).ToListAsync();

    /// <summary>Liste les chefs filtrés sous forme de DTO.</summary>
    public async Task<IReadOnlyList<ChefListDto>> ListAsync(ChefFilterDto filter)
    {
        var list = await BaseQuery(filter).OrderBy(c => c.NomComplet).ToListAsync();
        var noms = await EcoleNomsByMatriculeAsync(list.Select(c => c.Matricule));
        return list.Select(c => Map(c, noms.GetValueOrDefault(c.Matricule))).ToList();
    }

    /// <summary>Retourne un chef par matricule.</summary>
    public async Task<ChefListDto?> GetAsync(string id)
    {
        var c = await _db.ChefEtablissements.AsNoTracking().FirstOrDefaultAsync(x => x.Matricule == id);
        if (c == null) return null;
        var noms = await EcoleNomsByMatriculeAsync([c.Matricule]);
        return Map(c, noms.GetValueOrDefault(c.Matricule));
    }

    /// <summary>Crée ou met à jour un chef d'établissement.</summary>
    public async Task<ApiResultDto> SaveAsync(SaveChefDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.NomComplet))
            return ApiResultDto.Fail("Nom obligatoire.");

        var nom = dto.NomComplet.Trim();
        var tel = dto.Telephone?.Trim() ?? "";
        var email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim();
        if (email != null && (email.Length > 200 || !email.Contains('@') || email.StartsWith('@') || email.EndsWith('@')))
            return ApiResultDto.Fail("Adresse e-mail invalide.");

        var annee = dto.AnneeDebutActivite;
        if (annee is < 1900 or > 2100)
            return ApiResultDto.Fail("Année de début d'activité invalide.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.ChefEtablissements.FirstOrDefaultAsync(c => c.Matricule == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Chef d'établissement introuvable.");

            existing.NomComplet = nom;
            existing.Telephone = tel;
            existing.Email = email;
            existing.AnneeDebutActivite = annee;
            await _db.SaveChangesAsync();
            _users.AddJournal("Chefs", "modification", $"Chef d'établissement {existing.NomComplet}");
            return ApiResultDto.Ok("Chef d'établissement enregistré.", new { id = existing.Matricule });
        }

        var matricule = (dto.Matricule ?? "").Trim();
        if (string.IsNullOrWhiteSpace(matricule))
            return ApiResultDto.Fail("Matricule obligatoire.");

        if (await _db.ChefEtablissements.AnyAsync(c => c.Matricule == matricule))
            return ApiResultDto.Fail("Ce matricule est déjà utilisé.");

        var chef = new Chef
        {
            Matricule = matricule,
            NomComplet = nom,
            Telephone = tel,
            Email = email,
            AnneeDebutActivite = annee
        };
        _db.ChefEtablissements.Add(chef);
        await _db.SaveChangesAsync();
        _users.AddJournal("Chefs", "création", $"Chef d'établissement {chef.NomComplet}");
        return ApiResultDto.Ok("Chef d'établissement enregistré.", new { id = chef.Matricule });
    }

    /// <summary>Supprime un chef s'il n'est plus rattaché à une école.</summary>
    public async Task<ApiResultDto> DeleteAsync(string id)
    {
        var chef = await _db.ChefEtablissements.FirstOrDefaultAsync(c => c.Matricule == id);
        if (chef == null) return ApiResultDto.Fail("Chef d'établissement introuvable.");

        if (await _db.Ecoles.AnyAsync(e => e.MatriculeChef == id))
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Ce chef d'établissement ne peut pas être retiré pour le moment.",
                "Il est encore désigné comme responsable d'un ou plusieurs établissements.\n\n" +
                "Assignez d'abord un autre chef depuis la fiche de chaque établissement concerné, puis réessayez.");

        _db.ChefEtablissements.Remove(chef);
        await _db.SaveChangesAsync();
        _users.AddJournal("Chefs", "suppression", $"Chef d'établissement {chef.NomComplet} supprimé");
        return ApiResultDto.Ok("Chef d'établissement supprimé.");
    }
}
