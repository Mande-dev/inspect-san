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
/// Génère le PDF de l'ordre de mission via Chromium (Playwright),
/// à partir du même HTML/CSS que l'impression navigateur.
/// </summary>
public class OrdreMissionPdfService : IOrdreMissionPdfService
{
    private static readonly SemaphoreSlim BrowserGate = new(1, 1);
    private static readonly object InstallLock = new();
    private static bool _chromiumReady;

    private readonly InspectSanDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<OrdreMissionPdfService> _logger;

    public OrdreMissionPdfService(
        InspectSanDbContext db,
        IWebHostEnvironment env,
        ILogger<OrdreMissionPdfService>? logger = null)
    {
        _db = db;
        _env = env;
        _logger = logger ?? Microsoft.Extensions.Logging.Abstractions.NullLogger<OrdreMissionPdfService>.Instance;
    }

    /// <inheritdoc />
    public string BuildFileName(string numOrdre)
    {
        var safe = string.Concat((numOrdre ?? "mission").Select(c =>
            char.IsLetterOrDigit(c) || c is '-' or '_' ? c : '-'));
        if (string.IsNullOrWhiteSpace(safe)) safe = "mission";
        return $"OM-{safe}.pdf";
    }

    /// <inheritdoc />
    public async Task<byte[]> GenerateAsync(string missionId, CancellationToken ct = default)
    {
        var mission = await _db.Missions.AsNoTracking()
            .Include(m => m.Ecole)!.ThenInclude(e => e!.ChefEtablissement)
            .Include(m => m.Affectations).ThenInclude(a => a.Agent)
            .FirstOrDefaultAsync(m => m.Id == missionId, ct)
            ?? throw new InvalidOperationException("Mission introuvable.");

        var html = BuildPrintDocumentHtml(mission);
        return await RenderPdfAsync(html, ct);
    }

    /// <summary>Reproduit buildOrdrePrintHtml + enveloppe CSS print-official.</summary>
    internal string BuildPrintDocumentHtml(Models.Entities.Mission mission)
    {
        var webRoot = _env.WebRootPath ?? "";
        var cssPath = Path.Combine(webRoot, "css", "print-official.css");
        var css = File.Exists(cssPath)
            ? File.ReadAllText(cssPath, Encoding.UTF8)
            : "/* print-official.css introuvable */";

        var logoUri = ToDataUri(Path.Combine(webRoot, "assets", "images", "brand", "logo", "logo_new.png"));
        var sigUri = ToDataUri(Path.Combine(webRoot, "assets", "images", "signatures", "directeur-provincial.png"));

        var agents = mission.Affectations
            .OrderBy(a => a.Fonction == RolesMissionCodes.ChefEquipe ? 0
                : a.Fonction == RolesMissionCodes.ChefAdjoint ? 1 : 2)
            .ThenBy(a => a.Agent?.NomAgent)
            .ToList();

        var debut = mission.DateDebut;
        var fin = mission.DateFin;
        var dateDoc = debut ?? mission.SigneLe ?? mission.CreatedAt;
        var dateKin = FmtDate(dateDoc);
        if (dateKin == "—")
            dateKin = FmtDate(DateTime.Now);

        var dureeTxt = "—";
        if (debut.HasValue && fin.HasValue)
        {
            var days = (int)Math.Round((fin.Value.Date - debut.Value.Date).TotalDays) + 1;
            if (days > 0)
                dureeTxt = days == 1 ? "1 jour" : $"{days} jours";
        }

        var adresse = string.IsNullOrWhiteSpace(mission.Ecole?.Adresse)
            ? "—"
            : mission.Ecole!.Adresse.Trim();
        var numero = mission.NumOrdre ?? "";

        var agentsSb = new StringBuilder();
        agentsSb.Append(
            "<table class=\"isp-om-agents\">" +
            "<thead><tr>" +
            "<th>MATRICULE</th><th>NOMS ET POST-NOM</th><th>FONCTION</th><th>TÉLÉPHONE</th>" +
            "</tr></thead><tbody>");
        if (agents.Count == 0)
        {
            agentsSb.Append("<tr><td colspan=\"4\" class=\"text-center\">Aucun participant</td></tr>");
        }
        else
        {
            foreach (var a in agents)
            {
                var tel = string.IsNullOrWhiteSpace(a.Agent?.TelAgent) ? "—" : a.Agent!.TelAgent!;
                agentsSb.Append("<tr>")
                    .Append("<td class=\"isp-om-center\">").Append(Esc(a.MatrAgent)).Append("</td>")
                    .Append("<td>").Append(Esc(a.Agent?.NomAgent ?? "—")).Append("</td>")
                    .Append("<td>").Append(Esc(RolesMissionCodes.LabelOf(a.Fonction))).Append("</td>")
                    .Append("<td>").Append(Esc(tel)).Append("</td>")
                    .Append("</tr>");
            }
        }
        agentsSb.Append("</tbody></table>");

        var infoGrid =
            "<table class=\"isp-om-info\"><tbody>" +
            "<tr><td><strong>Adresse Établissement :</strong> " + Esc(adresse) + "</td></tr>" +
            "<tr><td><strong>Durée de la mission :</strong> " + Esc(dureeTxt) + "</td></tr>" +
            "<tr><td><strong>Date début Mission :</strong> " + Esc(FmtDate(debut)) + "</td></tr>" +
            "<tr><td><strong>Date Fin Mission :</strong> " + Esc(FmtDate(fin)) + "</td></tr>" +
            "</tbody></table>";

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
            "<p class=\"isp-om-footer-text\">MINEDU-NC  •  Province Éducationnelle Kinshasa Mont-Amba  •  Ordre de Mission" +
            (string.IsNullOrEmpty(numero) ? "" : " " + Esc(numero)) +
            "</p>" +
            "</footer>";

        var article =
            "<article class=\"isp-print-doc isp-om-doc\">" +
            "<div class=\"isp-om-body\">" +
            header +
            "<h1 class=\"isp-om-title\">ORDRE DE MISSION N° : " + Esc(string.IsNullOrEmpty(numero) ? "—" : numero) + "</h1>" +
            "<p class=\"isp-om-intro\">" +
            "<strong>1.</strong> Les cadres et agents de la Province Éducationnelle de Kinshasa Mont-Amba dont les noms, post-noms, fonction et téléphone repris ci-dessous sont désignés pour effectuer une mission officielle. Il s'agit de :" +
            "</p>" +
            agentsSb +
            infoGrid +
            "<p class=\"isp-om-nb\"><strong>N.B. :</strong></p>" +
            "<ul class=\"isp-om-bullets\">" +
            "<li>À l'issue de la mission, les intéressés sont priés d'établir un rapport succinct ;</li>" +
            "<li>Les autorités tant civiles, militaires ainsi que la Police Nationale Congolaise sont priées d'apporter toute leur aide et assistance aux porteurs de la présente.</li>" +
            "</ul>" +
            "<p class=\"isp-om-sign\">DIRECTEUR PROVINCIAL" +
            (sigUri != null
                ? "<br /><img class=\"isp-om-sign-img\" src=\"" + sigUri + "\" alt=\"Signature du Directeur Provincial\" />"
                : "") +
            "</p>" +
            "</div>" +
            footer +
            "</article>";

        return
            "<!DOCTYPE html><html lang=\"fr\"><head>" +
            "<meta charset=\"utf-8\" />" +
            "<title>Ordre de mission " + Esc(numero) + "</title>" +
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
            // Laisse le temps au layout / images data-uri
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
            _logger.LogError(ex, "Échec rendu PDF Playwright (Chromium).");
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
            // Installe Chromium au besoin (idempotent si déjà présent).
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
