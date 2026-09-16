namespace inspect_san.Models.Constants;

/// <summary>Type de donnée du dictionnaire métier (grille de codification).</summary>
public enum TypeDonnee
{
    /// <summary>Alphanumérique (X).</summary>
    X,
    /// <summary>Numérique (N).</summary>
    N,
    /// <summary>Date (D).</summary>
    D
}

/// <summary>Entrée du dictionnaire de données (CODE / DESIGNATION / TYPE / TAILLE).</summary>
public sealed record EntreeDictionnaire(
    string Code,
    string Designation,
    TypeDonnee Type,
    int Taille,
    string? PropertyPath = null);

/// <summary>
/// Vocabulaire officiel de codification (40 champs).
/// Les libellés UI doivent utiliser <see cref="Label"/> ; les tailles sont documentaires
/// (pas appliquées en dur si elles cassent les formats métier actuels).
/// </summary>
public static class DictionnaireDonnees
{
    public static readonly IReadOnlyList<EntreeDictionnaire> All =
    [
        new("Adr_Etab", "Adresse de l’Établissement", TypeDonnee.X, 50, "Ecole.Adresse"),
        new("Code_Cat", "Code Catégorie", TypeDonnee.X, 1, "Ecole.CodeCategories"),
        new("code_Sous", "Code Sous-division", TypeDonnee.N, 4, "Ecole.SousDivision"),
        new("Date_Deb_M", "Date de début de la mission", TypeDonnee.D, 8, "Mission.DateDebut"),
        new("Date_Fin_M", "Date de Fin de la mission", TypeDonnee.D, 8, "Mission.DateFin"),
        new("Date_Déc", "Date de la décision", TypeDonnee.D, 8, "Decision.DecideLe"),
        new("Date_Deb_Act", "Date du début d’activité", TypeDonnee.D, 8, "Chef.AnneeDebutActivite"),
        new("Date_OM", "Date ordre de mission", TypeDonnee.D, 8, "Mission.DateDebut"),
        new("Décision_Fin", "Décision Finale", TypeDonnee.X, 25, "Decision.DecisionFin"),
        new("Dénomination", "Dénomination Établissement", TypeDonnee.X, 50, "Ecole.Denomination"),
        new("Dési_Cat", "Désignation Catégorie", TypeDonnee.X, 15, "Categorie.Designation"),
        new("Dési_Out_Net", "Désignation outil de nettoyage", TypeDonnee.X, 50, "Outil.LibelleOutile"),
        new("Dési_Prod_Net", "Désignation Produit de nettoyage", TypeDonnee.X, 50, "Produit.LibeleProduit"),
        new("Dur_Mis", "Durée de la Mission", TypeDonnee.N, 2, null),
        new("Etat_Bat", "État du Bâtiment", TypeDonnee.X, 15, "Mission.EtatBatiment"),
        new("Fonct_Ctrl", "Fonction de l’Agent dans la mission", TypeDonnee.X, 30, "Affectation.Fonction"),
        new("Id_Dinacope", "Identifiant DINACOPE", TypeDonnee.X, 7, "Ecole.IdDinacope"),
        new("Lib_Sous", "Libellé sous-division", TypeDonnee.X, 50, "SousProvince.Libelle"),
        new("Matr_Ag", "Matricule de l’Agent", TypeDonnee.X, 7, "Agent.MatrAgent"),
        new("Matr_Chef_Etab", "Matricule du Chef d’Établissement", TypeDonnee.X, 7, "Chef.Matricule"),
        new("Mont_Perc", "Montant Perçu", TypeDonnee.N, 6, "Mission.MontPer"),
        new("Nom_Chef", "Nom du Chef d’Établissement", TypeDonnee.X, 50, "Chef.NomComplet"),
        new("Nb_Elev", "Nombre d’élèves", TypeDonnee.N, 4, "Mission.NbrEleve"),
        new("Nb_Out_Net", "Nombre d’outil de Nettoyage", TypeDonnee.N, 2, "Mission.NbreOutil"),
        new("Nb_Prod_Net", "Nombre de Produit de Nettoyage", TypeDonnee.N, 2, "Mission.NbreProduit"),
        new("Nb_Bat", "Nombre des Bâtiments", TypeDonnee.N, 1, "Mission.NbreBatiment"),
        new("Nb_Toil_Fil", "Nombre des toilettes Fille", TypeDonnee.N, 1, "Mission.NbrToiletteFille"),
        new("Nb_Toil_Gar", "Nombre des toilettes Garçon", TypeDonnee.N, 1, "Mission.NbrToiletteGarcon"),
        new("Noms_Ag", "Noms Agent", TypeDonnee.X, 50, "Agent.NomAgent"),
        new("Num_Agrément", "Numéro d’agrément de l’Établissement", TypeDonnee.X, 15, "Ecole.NumAgrement"),
        new("Num_Déc", "Numéro de la lettre de décision", TypeDonnee.X, 5, "Decision.NumDecision"),
        new("Num_Notif", "Numéro de notification", TypeDonnee.X, 2, "Ecole.NumNotification"),
        new("Num_OM", "Numéro ordre de Mission", TypeDonnee.N, 3, "Mission.NumOrdre"),
        new("Num_Tel_Chef", "Numéro téléphone du Chef d’Établissement", TypeDonnee.X, 13, "Chef.Telephone"),
        new("Obs", "Observation et conclusion", TypeDonnee.X, 100, "Mission.Observation"),
        new("Reg_Ges", "Régime de Gestion", TypeDonnee.X, 30, "Ecole.RegGes"),
        new("Tel_Ag", "Téléphone Agent", TypeDonnee.X, 13, "Agent.TelAgent"),
        new("Tot_Gen", "Total Général", TypeDonnee.N, 3, null),
        new("Tot_Div", "Total par sous-division", TypeDonnee.N, 2, null),
        new("Valid", "Validation Contrôle", TypeDonnee.X, 20, "Mission.Validite"),
    ];

    private static readonly IReadOnlyDictionary<string, EntreeDictionnaire> ByCode =
        All.ToDictionary(e => e.Code, StringComparer.OrdinalIgnoreCase);

    /// <summary>Retourne l’entrée pour un CODE, ou null si inconnu.</summary>
    public static EntreeDictionnaire? Of(string? code)
        => !string.IsNullOrWhiteSpace(code) && ByCode.TryGetValue(code, out var e) ? e : null;

    /// <summary>Libellé DESIGNATION officiel pour un CODE (sinon le code lui-même).</summary>
    public static string Label(string code)
        => Of(code)?.Designation ?? code;
}
