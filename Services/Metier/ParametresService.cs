using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using inspect_san.Models.DTOs;
using inspect_san.Models.Entities;
using inspect_san.Interface;
using inspect_san.Services.Mock;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Services;

/// <summary>CRUD des référentiels de paramètres.</summary>
public class ParametresService : IParametresService
{
    private readonly InspectSanDbContext _db;
    private readonly MockUserStore _users;

    /// <summary>Initialise le service paramètres avec EF et le journal.</summary>
    public ParametresService(InspectSanDbContext db, MockUserStore users)
    {
        _db = db;
        _users = users;
    }

    /// <summary>Normalise le nom d'onglet paramètres.</summary>
    private static string NormalizeTab(string tab) => tab switch
    {
        RefCategories.Categories or "categories" => RefCategories.Categories,
        RefCategories.Produits or "produits" => RefCategories.Produits,
        RefCategories.Outils or "outils" => RefCategories.Outils,
        RefCategories.SousDivisions or "sous_divisions" or "sousdivisions" => RefCategories.SousDivisions,
        _ => tab
    };

    /// <summary>Retourne les éléments de référentiel pour un onglet.</summary>
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
            RefCategories.SousDivisions => await _db.SousProvinces.AsNoTracking()
                .OrderBy(x => x.Code)
                .Select(x => new RefItem
                {
                    Code = x.Code,
                    Categorie = RefCategories.SousDivisions,
                    Nom = x.Libelle,
                    Libelle = x.Libelle
                }).ToListAsync(),
            _ => []
        };
    }

    /// <summary>Liste les éléments de référentiel sous forme de DTO.</summary>
    public async Task<IReadOnlyList<RefItemDto>> ListAsync(string tab)
    {
        var list = await QueryEntitiesAsync(tab);
        return list.Select(i =>
        {
            var isNumeric = int.TryParse(i.Code, out var c);
            return new RefItemDto
            {
                Code = isNumeric ? c : 0,
                CodeText = isNumeric ? null : i.Code,
                Categorie = i.Categorie,
                Nom = i.Nom,
                Libelle = i.Libelle
            };
        }).ToList();
    }

    /// <summary>Crée ou met à jour un élément de référentiel.</summary>
    public async Task<ApiResultDto> SaveAsync(string tab, SaveRefItemDto dto)
    {
        var cat = NormalizeTab(tab);
        return cat switch
        {
            RefCategories.Categories => await SaveCategorieAsync(dto),
            RefCategories.Produits => await SaveProduitAsync(dto),
            RefCategories.Outils => await SaveOutilAsync(dto),
            RefCategories.SousDivisions => await SaveSousDivisionAsync(dto),
            _ => ApiResultDto.Fail("Onglet paramètres inconnu.")
        };
    }

    /// <summary>Enregistre une catégorie d'établissement.</summary>
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

    /// <summary>Enregistre un produit du référentiel.</summary>
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

    /// <summary>Enregistre un outil du référentiel.</summary>
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

    /// <summary>Enregistre une sous-division (table SousProvince).</summary>
    private async Task<ApiResultDto> SaveSousDivisionAsync(SaveRefItemDto dto)
    {
        var libelle = (dto.Nom ?? dto.Libelle ?? "").Trim();
        if (string.IsNullOrEmpty(libelle))
            return ApiResultDto.Fail("Libellé obligatoire.");

        var codeText = (dto.CodeText ?? "").Trim().ToUpperInvariant();
        var isEdit = !string.IsNullOrEmpty(codeText);

        if (await _db.SousProvinces.AnyAsync(s =>
                s.Libelle == libelle && (!isEdit || s.Code != codeText)))
            return ApiResultDto.Fail("Ce libellé de sous-division existe déjà.");

        if (isEdit)
        {
            var existing = await _db.SousProvinces.FirstOrDefaultAsync(s => s.Code == codeText);
            if (existing == null)
                return ApiResultDto.Fail("Sous-division introuvable.");
            existing.Libelle = libelle;
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "modification", $"Sous-division {existing.Code} — {libelle}");
        }
        else
        {
            var code = await NextSousProvinceCodeAsync();
            if (code.Length > 10)
                return ApiResultDto.Fail("Impossible de générer un nouveau code SP.");
            _db.SousProvinces.Add(new SousProvince { Code = code, Libelle = libelle });
            await _db.SaveChangesAsync();
            _users.AddJournal("Paramètres", "création", $"Sous-division {code} — {libelle}");
        }
        return ApiResultDto.Ok("Référence enregistrée.");
    }

    /// <summary>Calcule le prochain code SP00x disponible.</summary>
    private async Task<string> NextSousProvinceCodeAsync()
    {
        var codes = await _db.SousProvinces.AsNoTracking().Select(s => s.Code).ToListAsync();
        var max = 0;
        foreach (var c in codes)
        {
            if (c.Length > 2
                && c.StartsWith("SP", StringComparison.OrdinalIgnoreCase)
                && int.TryParse(c.AsSpan(2), out var n)
                && n > max)
                max = n;
        }
        return $"SP{(max + 1):D3}";
    }

    /// <summary>Supprime un élément de référentiel s'il n'est plus utilisé.</summary>
    public async Task<ApiResultDto> DeleteAsync(string tab, string id)
    {
        var cat = NormalizeTab(tab);
        if (cat == RefCategories.SousDivisions)
            return await DeleteSousDivisionAsync(id);

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

    /// <summary>Supprime une sous-division si aucun établissement ne l'utilise.</summary>
    private async Task<ApiResultDto> DeleteSousDivisionAsync(string id)
    {
        var code = (id ?? "").Trim().ToUpperInvariant();
        if (string.IsNullOrEmpty(code))
            return ApiResultDto.Fail("Identifiant invalide.");

        var item = await _db.SousProvinces.FirstOrDefaultAsync(s => s.Code == code);
        if (item == null)
            return ApiResultDto.Ok("Référence supprimée.");

        if (await _db.Ecoles.AnyAsync(e => e.SousDivision == code))
            return ApiResultDto.FailBlocked(
                "Suppression non autorisée",
                "Cette sous-division ne peut pas être retirée.",
                "Elle est encore utilisée par un ou plusieurs établissements scolaires.\n\n" +
                "Modifiez d'abord la sous-division de ces établissements, puis réessayez.");

        _db.SousProvinces.Remove(item);
        await _db.SaveChangesAsync();
        _users.AddJournal("Paramètres", "suppression", $"Sous-division {code} supprimée");
        return ApiResultDto.Ok("Référence supprimée.");
    }
}
