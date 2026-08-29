namespace inspect_san.Models.ViewModels;

public class ErrorViewModel
{
    public string? RequestId { get; set; }
    public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
}

/// <summary>Stub — brancher Index.cshtml / HomeController.Index plus tard.</summary>
public class DashboardViewModel
{
    public string Role { get; set; } = "";
    public string RoleTip { get; set; } = "";
    public int EcolesCount { get; set; }
    public int MissionsEnCours { get; set; }
    public int FichesEnAttente { get; set; }
    public int DecisionsEnAttente { get; set; }
}

/// <summary>Stub — brancher Ecoles.cshtml plus tard à la place de ViewBag.</summary>
public class EcolesIndexViewModel
{
    public string? Q { get; set; }
    public string? Sousproved { get; set; }
    public string? Regime { get; set; }
    public string? Statut { get; set; }
}
