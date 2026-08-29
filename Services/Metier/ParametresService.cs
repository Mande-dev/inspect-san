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
        RefCategories.Categories or "categories" => RefCategories.Categories,
        RefCategories.Produits or "produits" => RefCategories.Produits,
        RefCategories.Outils or "outils" => RefCategories.Outils,
        _ => tab
    };

    public async Task<List<RefItem>> QueryEntitiesAsync(string tab)
    {
        var cat = NormalizeTab(tab);
        return cat switch
        {
            RefCategories.Categories => await _db.Categories.AsNoTracking()
                .OrderBy(x => x.Designation)
                .Select(x => new RefItem
                {
                    Code = x.CodeCategories.ToString(),
                    Categorie = RefCategories.Categories,
                    Nom = x.Designation,
                    Libelle = x.Designation
                }).ToListAsync(),
            RefCategories.Produits => await _db.Produits.AsNoTracking()
                .OrderBy(x => x.LibeleProduit)
                .Select(x => new RefItem
                {
                    Code = x.CodeProduit.ToString(),
                    Categorie = RefCategories.Produits,
                    Nom = x.LibeleProduit,
                    Libelle = x.LibeleProduit
                }).ToListAsync(),
            RefCategories.Outils => await _db.Outils.AsNoTracking()
                .OrderBy(x => x.LibelleOutile)
                .Select(x => new RefItem
                {
                    Code = x.CodeOutile.ToString(),
                    Categorie = RefCategories.Outils,
                    Nom = x.LibelleOutile,
                    Libelle = x.LibelleOutile
                }).ToListAsync(),
            _ => []
        };
    }

    public async Task<IReadOnlyList<RefItemDto>> ListAsync(string tab)
    {
        var list = await QueryEntitiesAsync(tab);
        return list.Select(i => new RefItemDto
        {
            Code = int.TryParse(i.Code, out var c) ? c : 0,
            Categorie = i.Categorie,
            Nom = i.Nom,
            Libelle = i.Libelle
        }).ToList();
    }

    public async Task<ApiResultDto> SaveAsync(string tab, SaveRefItemDto dto)
    {
        var cat = NormalizeTab(tab);
        return cat switch
        {
            RefCategories.Categories => await SaveCategorieAsync(dto),
            RefCategories.Produits => await SaveProduitAsync(dto),
            RefCategories.Outils => await SaveOutilAsync(dto),
            _ => ApiResultDto.Fail("Onglet paramètres inconnu.")
        };
    }

    private async Task<ApiResultDto> SaveCategorieAsync(SaveRefItemDto dto)
    {
        var designation = (dto.Nom ?? dto.Libelle ?? "").Trim();
        if (string.IsNullOrEmpty(designation))
            return ApiResultDto.Fail("Libellé obligatoire.");

        if (dto.Code > 0)
        {
            var existing = await _db.Categories.FirstOrDefaultAsync(c => c.CodeCategories == dto.Code);
            if (existing == null)
                return ApiResultDto.Fail("Catégorie introuvable.");
            existing.Designation = designation;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Catégorie {existing.Designation}");
        }
        else
        {
            _db.Categories.Add(new Categorie { Designation = designation });
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Catégorie {designation}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    private async Task<ApiResultDto> SaveProduitAsync(SaveRefItemDto dto)
    {
        var libelle = (dto.Nom ?? dto.Libelle ?? "").Trim();
        if (string.IsNullOrEmpty(libelle))
            return ApiResultDto.Fail("Libellé obligatoire.");

        if (dto.Code > 0)
        {
            var existing = await _db.Produits.FirstOrDefaultAsync(p => p.CodeProduit == dto.Code);
            if (existing == null)
                return ApiResultDto.Fail("Produit introuvable.");
            existing.LibeleProduit = libelle;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Produit {existing.LibeleProduit}");
        }
        else
        {
            _db.Produits.Add(new Produit { LibeleProduit = libelle });
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Produit {libelle}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    private async Task<ApiResultDto> SaveOutilAsync(SaveRefItemDto dto)
    {
        var libelle = (dto.Nom ?? dto.Libelle ?? "").Trim();
        if (string.IsNullOrEmpty(libelle))
            return ApiResultDto.Fail("Libellé obligatoire.");

        if (dto.Code > 0)
        {
            var existing = await _db.Outils.FirstOrDefaultAsync(o => o.CodeOutile == dto.Code);
            if (existing == null)
                return ApiResultDto.Fail("Outil introuvable.");
            existing.LibelleOutile = libelle;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Outil {existing.LibelleOutile}");
        }
        else
        {
            _db.Outils.Add(new Outil { LibelleOutile = libelle });
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Outil {libelle}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    public async Task<ApiResultDto> DeleteAsync(string tab, string id)
    {
        var cat = NormalizeTab(tab);
        if (!int.TryParse(id.Trim(), out var code) || code <= 0)
            return ApiResultDto.Fail("Identifiant invalide.");

        switch (cat)
        {
            case RefCategories.Categories:
            {
                var item = await _db.Categories.FirstOrDefaultAsync(c => c.CodeCategories == code);
                if (item != null)
                {
                    if (await _db.Ecoles.AnyAsync(e => e.CodeCategories == code))
                        return ApiResultDto.FailBlocked(
                            "Suppression non autorisée",
                            "Cette catégorie ne peut pas être retirée.",
                            "Elle est encore utilisée par un ou plusieurs établissements scolaires.\n\n" +
                            "Modifiez d'abord la catégorie de ces établissements, puis réessayez.");
                    _db.Categories.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Catégorie {code} supprimée");
                }
                break;
            }
            case RefCategories.Produits:
            {
                var item = await _db.Produits.FirstOrDefaultAsync(p => p.CodeProduit == code);
                if (item != null)
                {
                    if (await _db.MissionProduits.AnyAsync(mp => mp.CodeProduit == code)
                        || await _db.Missions.AnyAsync(m => m.CodeProduit == code))
                        return ApiResultDto.FailBlocked(
                            "Suppression non autorisée",
                            "Ce produit ne peut pas être retiré du référentiel.",
                            "Il a déjà été saisi dans des missions ou fiches de contrôle.\n\n" +
                            "Le référentiel doit conserver cet élément pour la traçabilité des inspections.");
                    _db.Produits.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Produit {code} supprimé");
                }
                break;
            }
            case RefCategories.Outils:
            {
                var item = await _db.Outils.FirstOrDefaultAsync(o => o.CodeOutile == code);
                if (item != null)
                {
                    if (await _db.MissionOutils.AnyAsync(mo => mo.CodeOutil == code)
                        || await _db.Missions.AnyAsync(m => m.CodeOutil == code))
                        return ApiResultDto.FailBlocked(
                            "Suppression non autorisée",
                            "Cet outil ne peut pas être retiré du référentiel.",
                            "Il a déjà été saisi dans des missions ou fiches de contrôle.\n\n" +
                            "Le référentiel doit conserver cet élément pour la traçabilité des inspections.");
                    _db.Outils.Remove(item);
                    await _db.SaveChangesAsync();
                    _users.AddJournal("Paramètres", "suppression", $"Outil {code} supprimé");
                }
                break;
            }
            default:
                return ApiResultDto.Fail("Onglet paramètres inconnu.");
        }
        return ApiResultDto.Ok("Référence supprimée.");
    }
}
