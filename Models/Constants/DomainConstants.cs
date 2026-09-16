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

/// <summary>Statuts du cycle de vie d’une mission.</summary>
public static class MissionStatuts
{
    public const string Brouillon = "brouillon";
    public const string EnAttenteSignature = "en_attente_signature";
    public const string Signe = "signe";
    public const string EnCours = "en_cours";
    public const string Cloture = "cloture";
}

/// <summary>Alias de compatibilité (anciens OrdreStatuts).</summary>
public static class OrdreStatuts
{
    public const string Brouillon = MissionStatuts.Brouillon;
    public const string EnAttenteSignature = MissionStatuts.EnAttenteSignature;
    public const string Signe = MissionStatuts.Signe;
    public const string EnCours = MissionStatuts.EnCours;
    public const string Cloture = MissionStatuts.Cloture;
}

/// <summary>Statuts de la fiche de contrôle liée à une mission.</summary>
public static class FicheStatuts
{
    public const string Brouillon = "brouillon";
    public const string Validee = "validee";
    public const string EnAttenteValidation = "en_attente_validation";
}

/// <summary>Types de décisions administratives et libellés associés.</summary>
public static class DecisionTypes
{
    public const string SuspensionTemporaireChef = "suspension_temporaire_chef";
    public const string Rehabilitation = "rehabilitation";
    public const string FermetureTemporaire = "fermeture_temporaire";
    public const string EcoleBienEntretenue = "ecole_bien_entretenue";

    public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
    {
        [SuspensionTemporaireChef] = "Suspension Temporaire du chef d'établissement",
        [Rehabilitation] = "Réhabilitation",
        [FermetureTemporaire] = "Fermeture temporaire de l'Établissement",
        [EcoleBienEntretenue] = "École bien entretenue — Félicitations",
    };

    public static readonly IReadOnlyList<string> All =
    [
        SuspensionTemporaireChef,
        Rehabilitation,
        FermetureTemporaire,
        EcoleBienEntretenue
    ];

    /// <summary>Indique si le code de décision est reconnu.</summary>
    public static bool IsValid(string? code)
        => !string.IsNullOrWhiteSpace(code) && Labels.ContainsKey(code);

    /// <summary>Libellé affichable pour un code de décision.</summary>
    public static string LabelOf(string? code)
        => code != null && Labels.TryGetValue(code, out var l) ? l : (code ?? "");
}

/// <summary>Statuts d’exécution (compat ; non exposés dans l’UI Décisions).</summary>
public static class StatutsExecution
{
    // Conservé pour compat éventuelle ; non exposé dans l'UI Décisions.
    public const string EnAttente = "en_attente";
    public const string EnCours = "en_cours";
    public const string Executee = "executee";
}

/// <summary>Identifiants de catégories de référentiels.</summary>
public static class RefCategories
{
    public const string Categories = "categories";
    public const string Produits = "produits";
    public const string Outils = "outils";
    public const string SousDivisions = "sous-divisions";
}

/// <summary>Régime de gestion d’un établissement (constante, plus de table Regimes).</summary>
public static class RegGes
{
    public const string Public = "public";
    public const string PriveConventionne = "prive_conventionne";
    public const string PriveNonConventionne = "prive_non_conventionne";
    public const string Confessionnel = "confessionnel";

    public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
    {
        [Public] = "Public",
        [PriveConventionne] = "Privé conventionné",
        [PriveNonConventionne] = "Privé non conventionné",
        [Confessionnel] = "Confessionnel",
    };

    public static readonly IReadOnlyList<string> All =
    [
        Public,
        PriveConventionne,
        PriveNonConventionne,
        Confessionnel
    ];

    /// <summary>Indique si le code de régime est reconnu.</summary>
    public static bool IsValid(string? code)
        => !string.IsNullOrWhiteSpace(code) && Labels.ContainsKey(code);

    /// <summary>Libellé affichable pour un code de régime.</summary>
    public static string LabelOf(string? code)
        => code != null && Labels.TryGetValue(code, out var l) ? l : (code ?? "");
}

/// <summary>
/// Compat : codes SP00x (alignés sur <see cref="SousProvinceCatalog"/> / table SousProvince).
/// Préférer la table BDD pour les listes UI.
/// </summary>
public static class SousDivision
{
    public const string Kinsenso1 = "SP001";
    public const string Kinsenso2 = "SP002";
    public const string Lemba1 = "SP003";
    public const string Lemba2 = "SP004";
    public const string Limete1 = "SP005";
    public const string Limete2 = "SP006";
    public const string Limete3 = "SP007";
    public const string Matete1 = "SP008";
    public const string Matete2 = "SP009";
    public const string Ngaba = "SP010";

    public static readonly IReadOnlyDictionary<string, string> Labels =
        SousProvinceCatalog.Rows.ToDictionary(r => r.Code, r => r.Libelle);

    public static readonly IReadOnlyList<string> All =
        SousProvinceCatalog.Rows.Select(r => r.Code).ToList();

    /// <summary>Valide un code SP00x ou un code legacy.</summary>
    public static bool IsValid(string? code)
        => !string.IsNullOrWhiteSpace(code)
           && (Labels.ContainsKey(code)
               || SousProvinceCatalog.Rows.Any(r =>
                   string.Equals(r.LegacyCode, code, StringComparison.OrdinalIgnoreCase)));

    /// <summary>Libellé de sous-province pour un code.</summary>
    public static string LabelOf(string? code)
        => SousProvinceCatalog.LabelOf(code);

    /// <summary>Le code officiel est le code SP00x lui-même.</summary>
    public static string OfficialCodeOf(string? code)
    {
        var resolved = SousProvinceCatalog.CodeFromLegacyOrCode(code);
        return string.IsNullOrWhiteSpace(resolved) ? "—" : resolved!;
    }
}

/// <summary>Rôles d’affectation sur une mission.</summary>
public static class RolesMissionCodes
{
    public const string ChefEquipe = "chef_equipe";
    public const string ChefAdjoint = "chef_adjoint";
    public const string Membre = "membre";

    public static readonly IReadOnlyDictionary<string, string> Labels = new Dictionary<string, string>
    {
        [ChefEquipe] = "Chef d'équipe",
        [ChefAdjoint] = "Chef adjoint",
        [Membre] = "Membre",
    };

    public static readonly IReadOnlyList<string> All =
    [
        ChefEquipe,
        ChefAdjoint,
        Membre
    ];

    /// <summary>Indique si le code de rôle mission est reconnu.</summary>
    public static bool IsValid(string? code)
        => !string.IsNullOrWhiteSpace(code) && Labels.ContainsKey(code);

    /// <summary>Libellé affichable pour un rôle mission.</summary>
    public static string LabelOf(string? code)
        => code != null && Labels.TryGetValue(code, out var l) ? l : (code ?? "");
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

    public const string BucketBon = "Bon";
    public const string BucketMoyen = "Moyen";
    public const string BucketDegrade = "Dégradé";
    public const string BucketCritique = "Critique";

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

    /// <summary>Mappe un état formulaire vers un bucket de statistiques.</summary>
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

    /// <summary>Indique si le bucket est considéré conforme (Bon ou Moyen).</summary>
    public static bool IsConformeBucket(string bucket)
        => bucket is BucketBon or BucketMoyen;
}
