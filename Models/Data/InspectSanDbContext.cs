using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Models.Data;

/// <summary>
/// DbContext Inspect-San : métier (écoles → décisions) + Identity + journal/notifications.
/// </summary>
public class InspectSanDbContext : IdentityDbContext<ApplicationUser>
{
    public InspectSanDbContext(DbContextOptions<InspectSanDbContext> options) : base(options)
    {
    }

    public DbSet<Commune> Communes => Set<Commune>();
    public DbSet<Regime> Regimes => Set<Regime>();
    public DbSet<TypeDecision> TypesDecision => Set<TypeDecision>();
    public DbSet<Equipe> Equipes => Set<Equipe>();
    public DbSet<Controleur> Controleurs => Set<Controleur>();
    public DbSet<Ecole> Ecoles => Set<Ecole>();
    public DbSet<Chef> Chefs => Set<Chef>();
    public DbSet<OrdreMission> OrdresMission => Set<OrdreMission>();
    public DbSet<FicheControle> FichesControle => Set<FicheControle>();
    public DbSet<Rapport> Rapports => Set<Rapport>();
    public DbSet<RapportFiche> RapportFiches => Set<RapportFiche>();
    public DbSet<Decision> Decisions => Set<Decision>();
    public DbSet<JournalEntry> JournalEntries => Set<JournalEntry>();
    public DbSet<NotificationItem> Notifications => Set<NotificationItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(InspectSanDbContext).Assembly);

        modelBuilder.Entity<ApplicationUser>(b =>
        {
            b.Property(u => u.Nom).HasMaxLength(200).IsRequired();
            b.Property(u => u.Role).HasMaxLength(100);
            b.Property(u => u.Statut).HasMaxLength(40);
            b.Property(u => u.Equipe).HasMaxLength(100);
            b.Property(u => u.Telephone).HasMaxLength(40);
            b.Property(u => u.EcoleId).HasMaxLength(64);
            b.Property(u => u.EquipeId).HasMaxLength(64);
            b.Property(u => u.ControleurId).HasMaxLength(64);
            b.HasIndex(u => u.EcoleId);
            b.HasIndex(u => u.EquipeId);
            // Un chef (Controleur) ne peut être lié qu’à un compte (plusieurs NULL OK en MySQL).
            b.HasIndex(u => u.ControleurId).IsUnique();
        });
    }
}
