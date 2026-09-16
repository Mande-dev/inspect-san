namespace inspect_san.Interface;

/// <summary>Génère le PDF de l'ordre de mission côté serveur.</summary>
public interface IOrdreMissionPdfService
{
    /// <summary>Génère le PDF binaire pour une mission.</summary>
    Task<byte[]> GenerateAsync(string missionId, CancellationToken ct = default);

    /// <summary>Nom de fichier sûr pour la pièce jointe.</summary>
    string BuildFileName(string numOrdre);
}
