namespace inspect_san.Models.Entities;

/// <summary>Affectation agent ↔ mission — table Affectation.</summary>
public class Affectation
{
    public int IdAffectation { get; set; }
    public string NomOrdre { get; set; } = "";
    public string MatrAgent { get; set; } = "";
    /// <summary>Code <see cref="Constants.RolesMissionCodes"/>.</summary>
    public string Fonction { get; set; } = "";
    /// <summary>True si le chef d'équipe a cédé l'écriture à cet adjoint.</summary>
    public bool EcritureDeleguee { get; set; }

    public Mission? Mission { get; set; }
    public Agent? Agent { get; set; }
}
