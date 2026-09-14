namespace inspect_san.Services;

/// <summary>Options de stockage des fichiers uploadés.</summary>
public class FileStorageOptions
{
    public const string SectionName = "FileStorage";
    public string RootRelative { get; set; } = "uploads";
    public long MaxBytes { get; set; } = 5 * 1024 * 1024;
    public string[] AllowedExtensions { get; set; } =
        [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".doc", ".docx"];
}

/// <summary>Stockage sécurisé des fichiers métier sous wwwroot.</summary>
public interface IFileStorageService
{
    /// <summary>Enregistre un fichier autorisé et retourne son URL relative.</summary>
    Task<(bool Ok, string? RelativeUrl, string? Error)> SaveAsync(
        IFormFile file, string category, string ownerId, CancellationToken ct = default);
    /// <summary>Vérifie taille et extension du fichier uploadé.</summary>
    bool IsAllowed(IFormFile file, out string? error);
}

/// <summary>Implémentation locale du stockage de fichiers uploadés.</summary>
public class FileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;
    private readonly FileStorageOptions _options;

    /// <summary>Initialise le service avec l'environnement web et les options.</summary>
    public FileStorageService(IWebHostEnvironment env, Microsoft.Extensions.Options.IOptions<FileStorageOptions> options)
    {
        _env = env;
        _options = options.Value;
    }

    /// <summary>Vérifie taille et extension du fichier uploadé.</summary>
    public bool IsAllowed(IFormFile file, out string? error)
    {
        error = null;
        if (file == null || file.Length <= 0)
        {
            error = "Fichier vide.";
            return false;
        }
        if (file.Length > _options.MaxBytes)
        {
            error = $"Fichier trop volumineux (max {_options.MaxBytes / (1024 * 1024)} Mo).";
            return false;
        }
        var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? "";
        if (!_options.AllowedExtensions.Contains(ext))
        {
            error = $"Extension non autorisée ({ext}).";
            return false;
        }
        return true;
    }

    /// <summary>Enregistre un fichier autorisé et retourne son URL relative.</summary>
    public async Task<(bool Ok, string? RelativeUrl, string? Error)> SaveAsync(
        IFormFile file, string category, string ownerId, CancellationToken ct = default)
    {
        if (!IsAllowed(file, out var error))
            return (false, null, error);

        var safeOwner = string.Concat((ownerId ?? "tmp").Where(c => char.IsLetterOrDigit(c) || c is '-' or '_'));
        if (string.IsNullOrEmpty(safeOwner)) safeOwner = "tmp";
        var ext = Path.GetExtension(file.FileName)?.ToLowerInvariant() ?? ".bin";
        var fileName = $"{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid():N}{ext}";
        var relDir = Path.Combine(_options.RootRelative, category, safeOwner).Replace('\\', '/');
        var absDir = Path.Combine(_env.WebRootPath, relDir.Replace('/', Path.DirectorySeparatorChar));
        Directory.CreateDirectory(absDir);
        var absPath = Path.Combine(absDir, fileName);
        await using (var stream = File.Create(absPath))
            await file.CopyToAsync(stream, ct);

        var relativeUrl = "/" + Path.Combine(relDir, fileName).Replace('\\', '/');
        return (true, relativeUrl, null);
    }
}
