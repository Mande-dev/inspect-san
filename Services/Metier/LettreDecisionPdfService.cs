using System.Globalization;
using System.Net;
using System.Text;
using inspect_san.Interface;
using inspect_san.Models.Constants;
using inspect_san.Models.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Playwright;

namespace inspect_san.Services;

/// <summary>
/// Génère le PDF de la lettre de décision via Chromium (Playwright),
/// à partir du même HTML/CSS que l'impression navigateur (buildDecisionPrintHtml).
/// </summary>
public class LettreDecisionPdfService : ILettreDecisionPdfService
{
    private static readonly SemaphoreSlim BrowserGate = new(1, 1);
    private static readonly object InstallLock = new();
    private static bool _chromiumReady;

    private readonly InspectSanDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LettreDecisionPdfService> _logger;

    public LettreDecisionPdfService(
        InspectSanDbContext db,
        IWebHostEnvironment env,
        ILogger<LettreDecisionPdfService>? logger = null)
    {
        _db = db;
        _env = env;
        _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<LettreDecisionPdfService>.Instance;
    }

    /// <inheritdoc />
    public string BuildFileName(string numDecision)
    {
        var safe = string.Concat((numDecision ?? "decision").Select(c =>
            char.IsLetterOrDigit(c) || c is '-' or '_' or '/' ? c : '-'));
        safe = safe.Replace('/', '-');
        if (string.IsNullOrWhiteSpace(safe)) safe = "decision";
        return $"LD-{safe}.pdf";
    }

    /// <inheritdoc />
    public async Task<byte[]> GenerateAsync(string decisionId, CancellationToken ct = default)
    {
        var decision = await _db.Decisions.AsNoTracking()
            .Include(d => d.Ecole)!.ThenInclude(e => e!.ChefEtablissement)
            .FirstOrDefaultAsync(d => d.NumDecision == decisionId, ct)
            ?? throw new InvalidOperationException("Décision introuvable.");

        var html = BuildPrintDocumentHtml(decision);
        return await RenderPdfAsync(html, ct);
    }

    /// <summary>Reproduit buildDecisionPrintHtml + enveloppe CSS print-official.</summary>
    internal string BuildPrintDocumentHtml(Models.Entities.Decision decision)
    {
        var webRoot = _env.WebRootPath ?? "";
        var cssPath = Path.Combine(webRoot, "css", "print-official.css");
        var css = File.Exists(cssPath)
            ? File.ReadAllText(cssPath, Encoding.UTF8)
            : "/* print-official.css introuvable */";

        var logoUri = ToDataUri(Path.Combine(webRoot, "assets", "images", "brand", "logo", "logo_new.png"));
        var sigUri = ToDataUri(Path.Combine(webRoot, "assets", "images", "signatures", "directeur-provincial.png"));

        var numero = decision.NumDecision ?? "";
        var dateDoc = DateTime.Now;
        var dateKin = FmtDate(dateDoc);
        var yearRef = dateDoc.Year;

        var typeLabel = DecisionTypes.LabelOf(decision.DecisionFin);
        var decisionText = string.IsNullOrWhiteSpace(typeLabel) ? "—" : typeLabel;

        var ecoleLabel = string.IsNullOrWhiteSpace(decision.Ecole?.Denomination)
            ? "—"
            : decision.Ecole!.Denomination.Trim();
        var chefNom = decision.Ecole?.ChefEtablissement?.NomComplet?.Trim();
        if (string.IsNullOrWhiteSpace(chefNom))
            chefNom = "____________________";

        var refNum = string.IsNullOrEmpty(numero) ? "—" : numero;
        var refLine = $"DP-KMA/EDNC/LD/{yearRef}/{refNum}";

        var header =
            "<header class=\"isp-om-header\">" +
            "<div class=\"isp-om-header-grid\">" +
            "<div class=\"isp-om-logo-wrap\">" +
            (logoUri != null
                ? "<img class=\"isp-om-logo\" src=\"" + logoUri + "\" alt=\"Emblème RDC — MINEDU-NC\" />"
                : "") +
            "</div>" +
            "<div class=\"isp-om-head-text\">" +
            "<div class=\"isp-om-head-main\">" +
            "<div class=\"isp-om-head-titles\">" +
            "<p class=\"isp-om-state\">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>" +
            "<p class=\"isp-om-ministry\">Ministère de l'Éducation Nationale et Nouvelle Citoyenneté</p>" +
            "<p class=\"isp-om-province\">Province Éducationnelle de Kinshasa Mont-Amba</p>" +
            "</div>" +
            "<div class=\"isp-om-head-right\">" +
            "<p class=\"isp-om-head-date\">Kinshasa, " + Esc(dateKin) + "</p>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</header>";

        var footer =
            "<footer class=\"isp-om-footer\">" +
            "<div class=\"isp-om-tricolor\" aria-hidden=\"true\"><span></span><span></span><span></span></div>" +
            "<p class=\"isp-om-footer-text\">MINEDU-NC  •  Province Éducationnelle Kinshasa Mont-Amba  •  Lettre de Décision" +
            (string.IsNullOrEmpty(numero) ? "" : " " + Esc(numero)) +
            "</p>" +
            "</footer>";

        var signDpHtml =
            "<p><strong>Le Directeur Provincial</strong></p>" +
            (sigUri != null
                ? "<img class=\"isp-om-sign-img isp-ld-sign-img\" src=\"" + sigUri + "\" alt=\"Signature du Directeur Provincial\" />"
                : "<p class=\"isp-ld-sign-space\">&nbsp;</p><p>Signature &amp; Sceau Administratif</p>");

        // Même image de signature que l'ordre de mission (Directeur Provincial).
        var article =
            "<article class=\"isp-print-doc isp-om-doc isp-ld-doc\">" +
            "<div class=\"isp-om-body\">" +
            header +
            "<h1 class=\"isp-ld-title\">LETTRE DE DÉCISION</h1>" +
            "<p class=\"isp-ld-ref\"><strong>Réf :</strong> " + Esc(refLine) + "</p>" +
            "<div class=\"isp-ld-destinataire\">" +
            "<p><strong>À l'attention de :</strong> Monsieur/Madame le Chef d'Établissement</p>" +
            "<p><strong>Établissement :</strong> " + Esc(ecoleLabel) + "</p>" +
            "</div>" +
            "<p class=\"isp-ld-objet\"><strong>Objet :</strong> Notification de décision suite à l'inspection</p>" +
            "<p class=\"isp-ld-salut\">Monsieur/Madame le Chef d'Établissement,</p>" +
            "<p class=\"isp-ld-intro\">" +
            "À la suite du rapport d'inspection sanitaire transmis à nos services, le Directeur Provincial a arrêté la décision suivante concernant votre établissement :" +
            "</p>" +
            "<p class=\"isp-ld-decision\">" + Esc(decisionText) + "</p>" +
            "<p class=\"isp-ld-close\">Veuillez exécuter les présentes directives dès réception de cette notification.</p>" +
            "<div class=\"isp-ld-signs\">" +
            "<div class=\"isp-ld-sign-col\">" +
            "<p class=\"isp-ld-sign-head\">Pour Réception (Chef d'Établissement)</p>" +
            "<p><strong>Nom :</strong> " + Esc(chefNom) + "</p>" +
            "<p class=\"isp-ld-sign-space\">&nbsp;</p>" +
            "<p>Signature &amp; Cachet :</p>" +
            "</div>" +
            "<div class=\"isp-ld-sign-col isp-ld-sign-right\">" +
            "<p class=\"isp-ld-sign-head\">Pour la Direction Provinciale Kinshasa Mont-Amba :</p>" +
            signDpHtml +
            "</div>" +
            "</div>" +
            "</div>" +
            footer +
            "</article>";

        return
            "<!DOCTYPE html><html lang=\"fr\"><head>" +
            "<meta charset=\"utf-8\" />" +
            "<title>Lettre de décision " + Esc(numero) + "</title>" +
            "<style>\n" + css + "\n" +
            "html, body { background: #fff !important; }\n" +
            "body.isp-preview-screen { min-height: 0 !important; background: #fff !important; }\n" +
            "</style></head><body>" +
            article +
            "</body></html>";
    }

    private async Task<byte[]> RenderPdfAsync(string html, CancellationToken ct)
    {
        EnsureChromiumInstalled();

        await BrowserGate.WaitAsync(ct);
        try
        {
            using var playwright = await Playwright.CreateAsync();
            await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = true
            });
            var page = await browser.NewPageAsync();
            await page.SetContentAsync(html, new PageSetContentOptions
            {
                WaitUntil = WaitUntilState.Load
            });
            await page.EvaluateAsync("() => document.fonts && document.fonts.ready");

            var pdf = await page.PdfAsync(new PagePdfOptions
            {
                Format = "A4",
                PrintBackground = true,
                PreferCSSPageSize = true,
                Margin = new Margin
                {
                    Top = "0",
                    Right = "0",
                    Bottom = "0",
                    Left = "0"
                }
            });

            if (pdf == null || pdf.Length == 0)
                throw new InvalidOperationException("PDF Chromium vide.");
            return pdf;
        }
        catch (PlaywrightException ex)
        {
            _logger.LogError(ex, "Échec rendu PDF lettre de décision Playwright.");
            throw new InvalidOperationException(
                "Impossible de générer le PDF : Chromium Playwright non disponible. " +
                "Exécuter : powershell -File bin/Debug/net8.0/playwright.ps1 install chromium",
                ex);
        }
        finally
        {
            BrowserGate.Release();
        }
    }

    private static void EnsureChromiumInstalled()
    {
        if (_chromiumReady) return;
        lock (InstallLock)
        {
            if (_chromiumReady) return;
            var exit = Microsoft.Playwright.Program.Main(["install", "chromium"]);
            if (exit != 0)
            {
                throw new InvalidOperationException(
                    "Installation Chromium Playwright échouée (code " + exit + "). " +
                    "Exécuter manuellement : powershell -File bin/Debug/net8.0/playwright.ps1 install chromium");
            }
            _chromiumReady = true;
        }
    }

    private static string? ToDataUri(string path)
    {
        if (!File.Exists(path)) return null;
        var bytes = File.ReadAllBytes(path);
        var ext = Path.GetExtension(path).ToLowerInvariant();
        var mime = ext switch
        {
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
        return $"data:{mime};base64,{Convert.ToBase64String(bytes)}";
    }

    private static string FmtDate(DateTime? v)
    {
        if (!v.HasValue) return "—";
        return v.Value.ToLocalTime().ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
    }

    private static string Esc(string? s)
        => WebUtility.HtmlEncode(s ?? "");
}
