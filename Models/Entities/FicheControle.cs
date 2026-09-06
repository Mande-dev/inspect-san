namespace inspect_san.Models.Entities;

/// <summary>DTO interne / compatibilité — fiche = champs contrôle sur Mission.</summary>
public class FicheControle
{
    public string Id { get; set; } = "";
    public string Numero { get; set; } = "";
    public string MissionId { get; set; } = "";
    public string EcoleId { get; set; } = "";
    public string Statut { get; set; } = "brouillon";
    public int NombreBatiments { get; set; }
    public string EtatGeneral { get; set; } = "Satisfaisant";
    public int NombreEleves { get; set; }
    public int ToilettesFilles { get; set; }
    public int ToilettesGarcons { get; set; }
    public string? ProduitsAutres { get; set; }
    public int? ProduitsAutresQuantite { get; set; }
    public string? OutilsAutres { get; set; }
    public int? OutilsAutresQuantite { get; set; }
    public string? Observations { get; set; }
    public string RecommandationPreliminaire { get; set; } = "Maintien";
    public string? ValideePar { get; set; }
    public DateTime? ValideeLe { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    /// <summary>Montant perçu (persisté sur Mission.MontPer).</summary>
    public decimal? MontPer { get; set; }

    public int? CodeProduit { get; set; }
    public int NbreProduit { get; set; }
    public int? CodeOutil { get; set; }
    public int NbreOutil { get; set; }
    public List<ControleProduitCompat> ControleProduits { get; set; } = new();
    public List<ControleOutilCompat> ControleOutils { get; set; } = new();
    public List<Photo> Photos { get; set; } = new();

    public static FicheControle FromMission(Mission m, string? ecoleId = null)
    {
        var cp = m.MissionProduits?.Count > 0
            ? m.MissionProduits.Select(x => new ControleProduitCompat
            {
                ProduitCode = x.CodeProduit,
                Quantite = x.Quantite
            }).ToList()
            : m.CodeProduit.HasValue
                ? [new ControleProduitCompat { ProduitCode = m.CodeProduit.Value, Quantite = m.NbreProduit }]
                : [];

        var co = m.MissionOutils?.Count > 0
            ? m.MissionOutils.Select(x => new ControleOutilCompat
            {
                OutilCode = x.CodeOutil,
                Quantite = x.Quantite
            }).ToList()
            : m.CodeOutil.HasValue
                ? [new ControleOutilCompat { OutilCode = m.CodeOutil.Value, Quantite = m.NbreOutil }]
                : [];

        return new FicheControle
        {
            Id = m.Id,
            Numero = m.NumOrdre,
            MissionId = m.Id,
            EcoleId = ecoleId ?? m.Ecole?.Id ?? "",
            Statut = m.StatutFiche ?? FicheStatutsCompat.Brouillon,
            NombreBatiments = m.NbreBatiment,
            EtatGeneral = m.EtatBatiment,
            NombreEleves = m.NbrEleve,
            ToilettesFilles = m.NbrToiletteFille,
            ToilettesGarcons = m.NbrToiletteGarcon,
            ProduitsAutres = m.ProduitsAutres,
            ProduitsAutresQuantite = m.ProduitsAutresQuantite,
            OutilsAutres = m.OutilsAutres,
            OutilsAutresQuantite = m.OutilsAutresQuantite,
            Observations = m.Observation,
            RecommandationPreliminaire = m.RecommandationPreliminaire,
            ValideePar = m.ValideePar,
            ValideeLe = m.ValideeLe,
            CreatedAt = m.CreatedAt,
            UpdatedAt = m.CreatedAt,
            MontPer = m.MontPer,
            CodeProduit = cp.FirstOrDefault()?.ProduitCode ?? m.CodeProduit,
            NbreProduit = cp.Sum(x => x.Quantite),
            CodeOutil = co.FirstOrDefault()?.OutilCode ?? m.CodeOutil,
            NbreOutil = co.Sum(x => x.Quantite),
            ControleProduits = cp,
            ControleOutils = co,
            Photos = m.Photos.ToList()
        };
    }
}

public class ControleProduitCompat
{
    public int ProduitCode { get; set; }
    public int Quantite { get; set; }
}

public class ControleOutilCompat
{
    public int OutilCode { get; set; }
    public int Quantite { get; set; }
}

internal static class FicheStatutsCompat
{
    internal const string Brouillon = "brouillon";
}
