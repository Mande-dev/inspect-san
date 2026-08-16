namespace inspect_san.Models.Constants;

/// <summary>Clés string (compatibles mock actuel type "eco-001").</summary>
public static class EcoleStatuts
{
    public const string Active = "active";
    public const string FermetureTemporaire = "fermeture_temporaire";
    public const string Rehabilitation = "rehabilitation";
    public const string FermetureDefinitive = "fermeture_definitive";

    public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
    {
        [Active] = "Active",
        [FermetureTemporaire] = "Fermeture temporaire",
        [Rehabilitation] = "Réhabilitation",
        [FermetureDefinitive] = "Fermeture définitive",
    };
}

public static class OrdreStatuts
{
    public const string Brouillon = "brouillon";
    public const string EnAttenteSignature = "en_attente_signature";
    public const string Signe = "signe";
    public const string EnCours = "en_cours";
    public const string Cloture = "cloture";
}

public static class FicheStatuts
{
    public const string Brouillon = "brouillon";
    public const string Validee = "validee";
    public const string EnAttenteValidation = "en_attente_validation";
}

public static class RapportStatuts
{
    public const string Brouillon = "brouillon";
    public const string Depose = "depose";
    public const string Accuse = "accuse";
    public const string Transmis = "transmis";
    public const string Traite = "traite";
}

public static class DecisionTypes
{
    public const string Maintien = "maintien";
    public const string Avertissement = "avertissement";
    public const string Rehabilitation = "rehabilitation";
    public const string FermetureTemporaire = "fermeture_temporaire";
    public const string FermetureDefinitive = "fermeture_definitive";
}

public static class StatutsExecution
{
    public const string EnAttente = "en_attente";
    public const string EnCours = "en_cours";
    public const string Executee = "executee";
}

public static class RefCategories
{
    public const string Communes = "communes";
    public const string Regimes = "regimes";
    public const string TypesDecision = "typesDecision";
    public const string Equipes = "equipes";
}

/// <summary>
/// États généraux des bâtiments : valeurs formulaire + buckets stats.
/// Satisfaisant → Bon ; Mauvais ≡ Dégradé (un seul bucket « Dégradé »).
/// </summary>
public static class EtatBatiment
{
    public const string Bon = "Bon";
    public const string Satisfaisant = "Satisfaisant";
    public const string Moyen = "Moyen";
    public const string Mauvais = "Mauvais";
    public const string Critique = "Critique";

    /// <summary>Buckets du donut / taux de conformité (ordre d'affichage).</summary>
    public const string BucketBon = "Bon";
    public const string BucketMoyen = "Moyen";
    public const string BucketDegrade = "Dégradé";
    public const string BucketCritique = "Critique";

    /// <summary>Options du select fiche (valeurs stockées en base).</summary>
    public static readonly IReadOnlyList<string> FormOptions =
    [
        Bon,
        Satisfaisant,
        Moyen,
        Mauvais,
        Critique
    ];

    public static readonly IReadOnlyList<string> StatBuckets =
    [
        BucketBon,
        BucketMoyen,
        BucketDegrade,
        BucketCritique
    ];

    /// <summary>Mappe une valeur stockée (ou legacy seed « Dégradé ») vers un bucket stats. Null si inconnu.</summary>
    public static string? ToStatBucket(string? etat)
    {
        if (string.IsNullOrWhiteSpace(etat)) return null;
        return etat.Trim() switch
        {
            Bon or Satisfaisant => BucketBon,
            Moyen => BucketMoyen,
            Mauvais or "Dégradé" or "Degrade" => BucketDegrade,
            Critique => BucketCritique,
            _ => null
        };
    }

    public static bool IsConformeBucket(string bucket)
        => bucket is BucketBon or BucketMoyen;
}
