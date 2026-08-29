using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using inspect_san.Models.Data;
using inspect_san.Models.Identity;
using inspect_san.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.Configure<FileStorageOptions>(builder.Configuration.GetSection(FileStorageOptions.SectionName));
builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(EmailOptions.SectionName));
builder.Services.AddHomeServices();
builder.Services.AddHttpContextAccessor();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<InspectSanDbContext>(options =>
    {
        var serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
        options.UseMySql(connectionString, serverVersion);
    });
}

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 6;
        options.Password.RequireDigit = false;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.User.RequireUniqueEmail = true;
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<InspectSanDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, AppClaimsPrincipalFactory>();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Auth/Login";
    options.LogoutPath = "/Auth/Logout";
    options.AccessDeniedPath = "/Auth/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromHours(8);
    options.SlidingExpiration = true;
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<InspectSanDbContext>();
    if (db != null)
    {
        try
        {
            var seedLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");
            await db.Database.MigrateAsync();

            // One-shot : dotnet run -- --purge-entities
            if (args.Contains("--purge-entities", StringComparer.OrdinalIgnoreCase))
            {
                var purgeLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbPurger");
                await DbPurger.PurgeEntitiesMetierAsync(db, purgeLogger);
                DbPurger.ClearUploads(app.Environment.WebRootPath, purgeLogger);
                purgeLogger.LogWarning(
                    "Purge entités OK. Relancer sans --purge-entities. Seed métier recommandé OFF.");
                return;
            }

            // One-shot : dotnet run -- --purge-keep-admin
            if (args.Contains("--purge-keep-admin", StringComparer.OrdinalIgnoreCase))
            {
                var purgeLogger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbPurger");
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                await DbPurger.PurgeKeepAdminAsync(db, userManager, purgeLogger);
                DbPurger.ClearUploads(app.Environment.WebRootPath, purgeLogger);
                await IdentitySeeder.SeedAsync(userManager, roleManager);
                purgeLogger.LogWarning(
                    "Purge OK. Admin : {Email} / {Password}. Seed métier désactivé (Seed:MetierEnabled).",
                    IdentitySeeder.AdminEmail, IdentitySeeder.AdminPassword);
                return;
            }

            // Seed métier OFF par défaut (Seed:MetierEnabled=false) — évite de recharger la démo.
            if (builder.Configuration.GetValue("Seed:MetierEnabled", false))
                await DbSeeder.SeedAsync(db, seedLogger);
            else
                seedLogger.LogInformation("Seed métier ignoré (Seed:MetierEnabled=false).");

            var um = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var rm = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await IdentitySeeder.SeedAsync(um, rm);
        }
        catch (Exception ex)
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("DbSeeder");
            logger.LogWarning(ex, "Seed ignoré (base indisponible ou schéma non migré).");
        }
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
// Réexécute la vue NotFound tout en conservant le code HTTP (ex. 404).
app.UseStatusCodePagesWithReExecute("/Home/PageNotFound");
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Landing}/{action=Index}/{id?}");

app.Run();

public partial class Program { }
