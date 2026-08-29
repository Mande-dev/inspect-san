using System.Net;
using System.Security.Claims;
using FluentAssertions;
using inspect_san.Controllers;
using inspect_san.Models.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace inspect_san.Tests;

/// <summary>Factory HTTP sans MySQL (connexion vide + InMemory) pour smoke tests publics.</summary>
public sealed class PublicPagesWebAppFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                // Empêche Migrate/Seed MySQL au démarrage des tests.
                ["ConnectionStrings:DefaultConnection"] = ""
            });
        });
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll<DbContextOptions<InspectSanDbContext>>();
            services.RemoveAll<InspectSanDbContext>();

            var dbName = "PublicPages_" + Guid.NewGuid().ToString("N");
            services.AddDbContext<InspectSanDbContext>(options =>
                options.UseInMemoryDatabase(dbName));
        });
    }
}

public class PublicPagesSmokeTests : IClassFixture<PublicPagesWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly PublicPagesWebAppFactory _factory;

    public PublicPagesSmokeTests(PublicPagesWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    [Fact]
    public async Task Root_Anonymous_ReturnsLanding()
    {
        var response = await _client.GetAsync("/");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var html = await response.Content.ReadAsStringAsync();
        html.Should().Contain("Inspect");
        html.Should().Contain("San");
        html.Should().Contain("Se connecter");
    }

    [Fact]
    public async Task AccessDenied_ReturnsPage()
    {
        var response = await _client.GetAsync("/Auth/AccessDenied");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var html = await response.Content.ReadAsStringAsync();
        html.Should().Contain("Accès refusé");
    }

    [Fact]
    public async Task UnknownUrl_ReturnsReal404()
    {
        var response = await _client.GetAsync("/cette-page-nexiste-pas-xyz");
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        var html = await response.Content.ReadAsStringAsync();
        html.Should().Contain("Page introuvable");
    }

    [Fact]
    public void Cookie_AccessDeniedPath_IsConfigured()
    {
        using var scope = _factory.Services.CreateScope();
        var opts = scope.ServiceProvider
            .GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
            .Get(IdentityConstants.ApplicationScheme);
        opts.AccessDeniedPath.Value.Should().Be("/Auth/AccessDenied");
        opts.LoginPath.Value.Should().Be("/Auth/Login");
    }
}

public class LandingControllerTests
{
    [Fact]
    public void Index_AuthenticatedAdmin_RedirectsToHome()
    {
        var controller = new LandingController();
        var identity = new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.Name, "admin"),
            new Claim(ClaimTypes.Role, "Administrateur système")
        }, authenticationType: "Test");
        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = new ClaimsPrincipal(identity) }
        };

        var result = controller.Index().Should().BeOfType<RedirectToActionResult>().Subject;
        result.ControllerName.Should().Be("Home");
        result.ActionName.Should().Be("Index");
    }
}
