namespace inspect_san.Models.Entities;

public class Commune
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public bool Actif { get; set; } = true;

    public ICollection<Ecole> Ecoles { get; set; } = new List<Ecole>();
}

public class Regime
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public bool Actif { get; set; } = true;

    public ICollection<Ecole> Ecoles { get; set; } = new List<Ecole>();
}

public class TypeDecision
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public string? Code { get; set; }
    public string? Libelle { get; set; }
    public bool Actif { get; set; } = true;

    public ICollection<Decision> Decisions { get; set; } = new List<Decision>();
}

/// <summary>Équipe de contrôle — 1 chef membre + au plus 1 compte Identity (rôle Contrôleur).</summary>
public class Equipe
{
    public string Id { get; set; } = "";
    public string Nom { get; set; } = "";
    public bool Actif { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    /// <summary>Chef d’équipe (membre Controleur). Requis pour les équipes actives (validation app).</summary>
    public string? ChefControleurId { get; set; }

    public Controleur? ChefControleur { get; set; }
    public ICollection<Controleur> Controleurs { get; set; } = new List<Controleur>();
    public ICollection<OrdreMission> OrdresMission { get; set; } = new List<OrdreMission>();
}

/// <summary>Contrôleur terrain (membre d’équipe) — sans compte Identity (sauf le chef s’il a un login).</summary>
public class Controleur
{
    public string Id { get; set; } = "";
    public string NomComplet { get; set; } = "";
    public string? Telephone { get; set; }
    public string EquipeId { get; set; } = "";
    public bool Actif { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Equipe? Equipe { get; set; }
}
