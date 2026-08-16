using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

public class ParametresService : IParametresService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    public ParametresService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    private static string NormalizeTab(string tab) => tab switch
    {
        RefCategories.Communes or "communes" => RefCategories.Communes,
        RefCategories.Regimes or "regimes" => RefCategories.Regimes,
        RefCategories.TypesDecision or "typesDecision" => RefCategories.TypesDecision,
        RefCategories.Equipes or "equipes" => RefCategories.Equipes,
        _ => tab
    };

    public async Task<List<RefItem>> QueryEntitiesAsync(string tab)
    {
        var cat = NormalizeTab(tab);
        return cat switch
        {
            RefCategories.Communes => await _db.Communes.AsNoTracking()
                .OrderBy(x => x.Nom)
                .Select(x => new RefItem
                {
                    Id = x.Id,
                    Categorie = RefCategories.Communes,
                    Nom = x.Nom,
                    Code = x.Code,
                    Actif = x.Actif
                }).ToListAsync(),
            RefCategories.Regimes => await _db.Regimes.AsNoTracking()
                .OrderBy(x => x.Nom)
                .Select(x => new RefItem
                {
                    Id = x.Id,
                    Categorie = RefCategories.Regimes,
                    Nom = x.Nom,
                    Code = x.Code,
                    Actif = x.Actif
                }).ToListAsync(),
            RefCategories.TypesDecision => await _db.TypesDecision.AsNoTracking()
                .OrderBy(x => x.Nom)
                .Select(x => new RefItem
                {
                    Id = x.Id,
                    Categorie = RefCategories.TypesDecision,
                    Nom = x.Nom,
                    Code = x.Code,
                    Libelle = x.Libelle,
                    Actif = x.Actif
                }).ToListAsync(),
            RefCategories.Equipes => await _db.Equipes.AsNoTracking()
                .Include(x => x.ChefControleur)
                .OrderBy(x => x.Nom)
                .Select(x => new RefItem
                {
                    Id = x.Id,
                    Categorie = RefCategories.Equipes,
                    Nom = x.Nom,
                    Actif = x.Actif,
                    ChefControleurId = x.ChefControleurId,
                    ChefNom = x.ChefControleur != null ? x.ChefControleur.NomComplet : null
                }).ToListAsync(),
            _ => []
        };
    }

    public async Task<IReadOnlyList<RefItemDto>> ListAsync(string tab)
    {
        var list = await QueryEntitiesAsync(tab);
        return list.Select(i => new RefItemDto
        {
            Id = i.Id,
            Categorie = i.Categorie,
            Nom = i.Nom,
            Code = i.Code,
            Libelle = i.Libelle,
            Actif = i.Actif,
            ChefControleurId = i.ChefControleurId,
            ChefNom = i.ChefNom
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(string tab, SaveRefItemDto dto)
    {
        var cat = NormalizeTab(tab);
        return cat switch
        {
            RefCategories.Communes => await SaveCommuneAsync(dto),
            RefCategories.Regimes => await SaveRegimeAsync(dto),
            RefCategories.TypesDecision => await SaveTypeDecisionAsync(dto),
            RefCategories.Equipes => ApiResultDto.Fail("Utilisez SaveEquipeJson pour les équipes."),
            _ => ApiResultDto.Fail("Onglet paramètres inconnu.")
        };
    }

    private async Task<ApiResultDto> SaveCommuneAsync(SaveRefItemDto dto)
    {
        var nom = (dto.Nom ?? "").Trim();
        if (string.IsNullOrEmpty(nom)) return ApiResultDto.Fail("Nom obligatoire.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Communes.FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Référence introuvable.");
            existing.Nom = nom;
            existing.Code = dto.Code;
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Commune {existing.Nom}");
        }
        else
        {
            var item = new Commune
            {
                Id = NewId("com"),
                Nom = nom,
                Code = dto.Code,
                Actif = dto.Actif
            };
            _db.Communes.Add(item);
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Commune {item.Nom}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    private async Task<ApiResultDto> SaveRegimeAsync(SaveRefItemDto dto)
    {
        var nom = (dto.Nom ?? "").Trim();
        if (string.IsNullOrEmpty(nom)) return ApiResultDto.Fail("Nom obligatoire.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Regimes.FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Référence introuvable.");
            existing.Nom = nom;
            existing.Code = dto.Code;
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Régime {existing.Nom}");
        }
        else
        {
            var item = new Regime
            {
                Id = NewId("reg"),
                Nom = nom,
                Code = dto.Code,
                Actif = dto.Actif
            };
            _db.Regimes.Add(item);
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Régime {item.Nom}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    private async Task<ApiResultDto> SaveTypeDecisionAsync(SaveRefItemDto dto)
    {
        var nom = (dto.Libelle ?? dto.Nom ?? "").Trim();
        if (string.IsNullOrEmpty(nom)) return ApiResultDto.Fail("Libellé obligatoire.");

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.TypesDecision.FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Référence introuvable.");
            existing.Nom = nom;
            existing.Libelle = dto.Libelle ?? nom;
            existing.Code = dto.Code;
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Type décision {existing.Nom}");
        }
        else
        {
            var item = new TypeDecision
            {
                Id = NewId("td"),
                Nom = nom,
                Libelle = dto.Libelle ?? nom,
                Code = dto.Code,
                Actif = dto.Actif
            };
            _db.TypesDecision.Add(item);
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Type décision {item.Nom}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    public async Task<ApiResultDto> SaveEquipeAsync(SaveEquipeDto dto)
    {
        var nom = (dto.Nom ?? "").Trim();
        if (string.IsNullOrEmpty(nom)) return ApiResultDto.Fail("Nom obligatoire.");

        var chefId = (dto.ChefControleurId ?? "").Trim();

        if (!string.IsNullOrEmpty(dto.Id))
        {
            var existing = await _db.Equipes.FirstOrDefaultAsync(r => r.Id == dto.Id);
            if (existing == null) return ApiResultDto.Fail("Équipe introuvable.");

            if (!string.IsNullOrEmpty(chefId))
            {
                var assign = await AssignChefToEquipeAsync(existing.Id, chefId);
                if (!assign.Success) return ApiResultDto.Fail(assign.Message);
                existing.ChefControleurId = assign.ChefId;
            }
            else
            {
                existing.ChefControleurId = null;
            }

            existing.Nom = nom;
            existing.Actif = dto.Actif;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification",
                string.IsNullOrEmpty(existing.ChefControleurId)
                    ? $"Équipe {existing.Nom}"
                    : $"Équipe {existing.Nom} (chef {existing.ChefControleurId})");
            return ApiResultDto.Ok("Équipe enregistrée.");
        }

        var item = new Equipe
        {
            Id = NewId("eq"),
            Nom = nom,
            Actif = dto.Actif,
            CreatedAt = DateTime.UtcNow,
            ChefControleurId = null
        };
        _db.Equipes.Add(item);
        await _db.SaveChangesAsync();

        if (!string.IsNullOrEmpty(chefId))
        {
            var assigned = await AssignChefToEquipeAsync(item.Id, chefId);
            if (!assigned.Success)
            {
                _db.Equipes.Remove(item);
                await _db.SaveChangesAsync();
                return ApiResultDto.Fail(assigned.Message);
            }
            item.ChefControleurId = assigned.ChefId;
            await _db.SaveChangesAsync();
        }

        _users.AddJournal("Paramètres", "création",
            string.IsNullOrEmpty(item.ChefControleurId)
                ? $"Équipe {item.Nom}"
                : $"Équipe {item.Nom} (chef {item.ChefControleurId})");
        return ApiResultDto.Ok("Équipe enregistrée.");
    }

    private async Task<(bool Success, string Message, string? ChefId)> AssignChefToEquipeAsync(
        string equipeId, string chefId)
    {
        var chef = await _db.Controleurs.FirstOrDefaultAsync(c => c.Id == chefId);
        if (chef == null)
            return (false, "Chef d’équipe invalide.", null);

        if (!string.Equals(chef.EquipeId, equipeId, StringComparison.Ordinal))
            return (false, "Le chef doit être un membre de cette équipe.", null);

        var otherTeam = await _db.Equipes.AsNoTracking()
            .AnyAsync(e => e.ChefControleurId == chef.Id && e.Id != equipeId);
        if (otherTeam)
            return (false, "Ce contrôleur est déjà chef d’une autre équipe.", null);

        await _db.SaveChangesAsync();
        return (true, "OK", chef.Id);
    }

    public async Task<ApiResultDto> DeleteAsync(string tab, string id)
    {
        var cat = NormalizeTab(tab);
        switch (cat)
        {
            case RefCategories.Communes:
            {
                var item = await _db.Communes.FirstOrDefaultAsync(r => r.Id == id);
                if (item != null)
                {
                    if (await _db.Ecoles.AnyAsync(e => e.CommuneId == id))
                        return ApiResultDto.Fail("Commune utilisée par des écoles.");
                    _db.Communes.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Commune {id} supprimée");
                }
                break;
            }
            case RefCategories.Regimes:
            {
                var item = await _db.Regimes.FirstOrDefaultAsync(r => r.Id == id);
                if (item != null)
                {
                    if (await _db.Ecoles.AnyAsync(e => e.RegimeId == id))
                        return ApiResultDto.Fail("Régime utilisé par des écoles.");
                    _db.Regimes.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Régime {id} supprimé");
                }
                break;
            }
            case RefCategories.TypesDecision:
            {
                var item = await _db.TypesDecision.FirstOrDefaultAsync(r => r.Id == id);
                if (item != null)
                {
                    if (await _db.Decisions.AnyAsync(d => d.TypeDecisionId == id))
                        return ApiResultDto.Fail("Type utilisé par des décisions.");
                    _db.TypesDecision.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Type décision {id} supprimé");
                }
                break;
            }
            case RefCategories.Equipes:
            {
                var item = await _db.Equipes.FirstOrDefaultAsync(r => r.Id == id);
                if (item != null)
                {
                    if (await _db.OrdresMission.AnyAsync(o => o.EquipeId == id)
                        || await _db.Controleurs.AnyAsync(c => c.EquipeId == id))
                        return ApiResultDto.Fail("Équipe liée à des ordres ou contrôleurs.");
                    if (await _db.Users.AnyAsync(u => u.EquipeId == id))
                        return ApiResultDto.Fail("Équipe liée à un compte utilisateur.");
                    // Détacher le chef avant suppression (FK Restrict)
                    item.ChefControleurId = null;
                    await _db.SaveChangesAsync();
                    _db.Equipes.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Équipe {id} supprimée");
                }
                break;
            }
            default:
                return ApiResultDto.Fail("Onglet paramètres inconnu.");
        }
        return ApiResultDto.Ok("Référence supprimée.");
    }

    private static string NewId(string prefix)
        => $"{prefix}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..32];
}
