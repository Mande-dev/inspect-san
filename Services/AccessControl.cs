namespace inspect_san.Services;

/// <summary>Actions métier granulaires (au-delà de l’accès page).</summary>
public static class AccessActions
{
    public const string GererMission = "GererMission";
    public const string SignerMission = "SignerMission";
    public const string CreerFiche = "CreerFiche";
    public const string ValiderFiche = "ValiderFiche";
    public const string CreerDecision = "CreerDecision";
    public const string GererEcole = "GererEcole";
    public const string GererChefs = "GererChefs";
    public const string GererUtilisateurs = "GererUtilisateurs";
    public const string GererParametres = "GererParametres";
    public const string GererAgents = "GererAgents";

    // Alias de compatibilité temporaire
    public const string GererOrdre = GererMission;
    public const string SignerOrdre = SignerMission;
    public const string GererControleurs = GererAgents;
}

/// <summary>Contrôle d'accès pages et actions selon le rôle.</summary>
public static class AccessControl
{
    public static readonly Dictionary<string, string[]> RoleAccess = new()
    {
        ["Administrateur système"] =
        [
            "dashboard", "ecoles", "chefs", "agents", "utilisateurs", "missions", "fiches",
            "decisions", "statistiques", "rapport", "parametres", "journal"
        ],
        ["Directeur Provincial"] =
        [
            "dashboard", "ecoles", "chefs", "agents", "utilisateurs", "missions", "fiches",
            "decisions", "statistiques", "rapport", "parametres", "journal"
        ],
        ["Contrôleur"] =
        [
            "dashboard", "missions", "fiches", "decisions", "rapport"
        ]
    };

    private static readonly Dictionary<string, string[]> RoleActions = new()
    {
        ["Administrateur système"] =
        [
            AccessActions.GererMission, AccessActions.SignerMission,
            AccessActions.CreerFiche, AccessActions.ValiderFiche,
            AccessActions.CreerDecision,
            AccessActions.GererEcole, AccessActions.GererChefs, AccessActions.GererAgents,
            AccessActions.GererUtilisateurs, AccessActions.GererParametres
        ],
        ["Directeur Provincial"] =
        [
            AccessActions.GererMission, AccessActions.SignerMission,
            AccessActions.CreerFiche, AccessActions.ValiderFiche,
            AccessActions.CreerDecision,
            AccessActions.GererEcole, AccessActions.GererChefs, AccessActions.GererAgents,
            AccessActions.GererUtilisateurs, AccessActions.GererParametres
        ],
        ["Contrôleur"] =
        [
            AccessActions.CreerFiche, AccessActions.ValiderFiche
        ]
    };

    /// <summary>Indique si le rôle peut accéder à une page donnée.</summary>
    public static bool CanAccess(string? role, string pageKey)
        => role != null && RoleAccess.TryGetValue(role, out var keys) && keys.Contains(pageKey);

    /// <summary>Indique si le rôle peut exécuter une action métier.</summary>
    public static bool CanDo(string? role, string action)
        => role != null && RoleActions.TryGetValue(role, out var actions) && actions.Contains(action);

    public static readonly (string Key, string Path, string Label, string Icon)[] Nav =
    {
        ("dashboard", "/Home/Index", "Tableau de bord", "ti-layout-dashboard"),
        ("ecoles", "/Home/Ecoles", "Établissements", "ti-building-community"),
        ("chefs", "/Home/Chefs", "Chefs d'établissement", "ti-user-star"),
        ("agents", "/Home/Agents", "Agents", "ti-users-group"),
        ("utilisateurs", "/Home/Utilisateurs", "Utilisateurs", "ti-users"),
        ("missions", "/Home/Missions", "Missions", "ti-file-certificate"),
        ("fiches", "/Home/FichesControle", "Fiches de contrôle", "ti-clipboard-check"),
        ("decisions", "/Home/Decisions", "Décisions", "ti-gavel"),
        ("statistiques", "/Home/Statistiques", "Statistiques", "ti-chart-histogram"),
        ("rapport", "/Home/Rapport", "Rapport d'inspection", "ti-report-analytics"),
        ("parametres", "/Home/Parametres", "Paramètres", "ti-settings"),
        ("journal", "/Home/Journal", "Journal d'activité", "ti-history"),
    };

    /// <summary>Retourne la page d'accueil par défaut après connexion.</summary>
    public static (string Controller, string Action) DefaultLanding(string? role)
        => ("Home", "Index");
}
