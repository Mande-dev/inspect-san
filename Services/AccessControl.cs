namespace inspect_san.Services;

/// <summary>Actions métier granulaires (au-delà de l’accès page).</summary>
public static class AccessActions
{
    public const string GererOrdre = "GererOrdre";           // créer / modifier / supprimer OM
    public const string SignerOrdre = "SignerOrdre";
    public const string CreerFiche = "CreerFiche";           // créer / modifier fiche
    public const string ValiderFiche = "ValiderFiche";       // « Lu et approuvé »
    public const string CreerRapport = "CreerRapport";       // créer / modifier / déposer
    public const string AccuserRapport = "AccuserRapport";
    public const string TransmettreRapport = "TransmettreRapport";
    public const string CreerDecision = "CreerDecision";     // créer / modifier / supprimer
    public const string GererEcole = "GererEcole";           // CRUD école (admin) ; chef = limité côté service
    public const string GererChefs = "GererChefs";
    public const string GererUtilisateurs = "GererUtilisateurs";
    public const string GererParametres = "GererParametres";
    public const string GererControleurs = "GererControleurs";
}

public static class AccessControl
{
    public static readonly Dictionary<string, string[]> RoleAccess = new()
    {
        ["Administrateur système"] =
        [
            "dashboard", "ecoles", "chefs", "controleurs", "utilisateurs", "ordres", "fiches",
            "rapports", "accuses", "decisions", "statistiques", "parametres", "journal"
        ],
        ["Directeur Provincial"] =
        [
            "dashboard", "ordres", "rapports", "decisions", "statistiques"
        ],
        ["Contrôleur"] =
        [
            "dashboard", "ordres", "fiches", "rapports"
        ],
        ["Agent du Secrétariat"] =
        [
            "dashboard", "rapports", "accuses"
        ],
        ["Chef d'établissement"] =
        [
            "espace-chef"
        ]
    };

    private static readonly Dictionary<string, string[]> RoleActions = new()
    {
        ["Administrateur système"] =
        [
            AccessActions.GererOrdre, AccessActions.SignerOrdre,
            AccessActions.CreerFiche, AccessActions.ValiderFiche,
            AccessActions.CreerRapport,
            AccessActions.AccuserRapport, AccessActions.TransmettreRapport,
            AccessActions.CreerDecision,
            AccessActions.GererEcole, AccessActions.GererChefs, AccessActions.GererControleurs,
            AccessActions.GererUtilisateurs, AccessActions.GererParametres
        ],
        ["Directeur Provincial"] =
        [
            AccessActions.GererOrdre, AccessActions.SignerOrdre,
            AccessActions.CreerDecision
        ],
        ["Contrôleur"] =
        [
            AccessActions.CreerFiche, AccessActions.CreerRapport
        ],
        ["Agent du Secrétariat"] =
        [
            AccessActions.AccuserRapport, AccessActions.TransmettreRapport
        ],
        ["Chef d'établissement"] =
        [
            AccessActions.ValiderFiche
        ]
    };

    public static bool CanAccess(string? role, string pageKey)
        => role != null && RoleAccess.TryGetValue(role, out var keys) && keys.Contains(pageKey);

    public static bool CanDo(string? role, string action)
        => role != null && RoleActions.TryGetValue(role, out var actions) && actions.Contains(action);

    public static readonly (string Key, string Path, string Label, string Icon)[] Nav =
    {
        ("espace-chef", "/ChefEtablissement", "Mon établissement", "ti-building"),
        ("dashboard", "/Home/Index", "Tableau de bord", "ti-layout-dashboard"),
        ("ecoles", "/Home/Ecoles", "Écoles", "ti-building-community"),
        ("chefs", "/Home/Chefs", "Chefs d'établissement", "ti-user-star"),
        ("controleurs", "/Home/Controleurs", "Contrôleurs (membres)", "ti-users-group"),
        ("utilisateurs", "/Home/Utilisateurs", "Utilisateurs", "ti-users"),
        ("ordres", "/Home/OrdresMission", "Ordres de mission", "ti-file-certificate"),
        ("fiches", "/Home/FichesControle", "Fiches de contrôle", "ti-clipboard-check"),
        ("rapports", "/Home/Rapports", "Rapports d'inspection", "ti-report-analytics"),
        ("accuses", "/Home/Accuses", "Accusés de réception", "ti-mail-check"),
        ("decisions", "/Home/Decisions", "Décisions", "ti-gavel"),
        ("statistiques", "/Home/Statistiques", "Statistiques", "ti-chart-histogram"),
        ("parametres", "/Home/Parametres", "Paramètres", "ti-settings"),
        ("journal", "/Home/Journal", "Journal d'activité", "ti-history"),
    };

    /// <summary>Destination post-login / refus d’accès selon le rôle.</summary>
    public static (string Controller, string Action) DefaultLanding(string? role)
        => role == DataScope.RoleChef
            ? ("ChefEtablissement", "Index")
            : ("Home", "Index");
}
