namespace inspect_san.Interface;

/// <summary>Génère le PDF de la lettre de décision côté serveur.</summary>
public interface ILettreDecisionPdfService
{
    /// <summary>Génère le PDF binaire pour une décision.</summary>
    Task<byte[]> GenerateAsync(string decisionId, CancellationToken ct = default);

    /// <summary>Nom de fichier sûr pour la pièce jointe.</summary>
    string BuildFileName(string numDecision);
}
