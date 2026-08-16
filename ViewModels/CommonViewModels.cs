using System.ComponentModel.DataAnnotations;

namespace inspect_san.ViewModels;

public class LoginViewModel
{
    [Required(ErrorMessage = "E-mail requis.")]
    [EmailAddress]
    [Display(Name = "E-mail")]
    public string Email { get; set; } = "";

    [Required(ErrorMessage = "Mot de passe requis.")]
    [DataType(DataType.Password)]
    [Display(Name = "Mot de passe")]
    public string MotDePasse { get; set; } = "";

    public string? ReturnUrl { get; set; }
    public string? Error { get; set; }
}

public class ForgotPasswordViewModel
{
    [Required(ErrorMessage = "E-mail requis.")]
    [EmailAddress]
    public string Email { get; set; } = "";

    public string? Info { get; set; }
}

public class ResetPasswordViewModel
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Token { get; set; } = "";

    [Required(ErrorMessage = "Nouveau mot de passe requis.")]
    [StringLength(100, MinimumLength = 6)]
    [DataType(DataType.Password)]
    [Display(Name = "Nouveau mot de passe")]
    public string MotDePasse { get; set; } = "";

    [Required]
    [DataType(DataType.Password)]
    [Compare(nameof(MotDePasse), ErrorMessage = "Les mots de passe ne correspondent pas.")]
    [Display(Name = "Confirmation")]
    public string Confirmation { get; set; } = "";

    public string? Error { get; set; }
}

public class ProfilViewModel
{
    public string Id { get; set; } = "";

    [Required(ErrorMessage = "Nom requis.")]
    [Display(Name = "Nom complet")]
    public string Nom { get; set; } = "";

    [Required(ErrorMessage = "E-mail requis.")]
    [EmailAddress]
    [Display(Name = "E-mail")]
    public string Contact { get; set; } = "";

    [Display(Name = "Téléphone")]
    public string? Telephone { get; set; }

    [Display(Name = "Rôle")]
    public string Role { get; set; } = "";

    [Display(Name = "Équipe")]
    public string? Equipe { get; set; }

    [Display(Name = "École")]
    public string? EcoleNom { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Mot de passe actuel")]
    public string? MotDePasseActuel { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Nouveau mot de passe")]
    public string? NouveauMotDePasse { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirmation")]
    public string? ConfirmationMotDePasse { get; set; }

    public string? Error { get; set; }
}

public class EcoleFormViewModel
{
    public string? Id { get; set; }

    [Required]
    public string Denomination { get; set; } = "";

    [Required]
    public string RegimeId { get; set; } = "";

    [Required]
    public string IdDinacope { get; set; } = "";

    public string? NumAgrement { get; set; }
    public string? NumNotification { get; set; }

    [Required]
    public string CommuneId { get; set; } = "";

    public string Quartier { get; set; } = "";
    public string Avenue { get; set; } = "";
    public string Numero { get; set; } = "";

    public string Statut { get; set; } = "active";
    public string Mode { get; set; } = "create";
}
