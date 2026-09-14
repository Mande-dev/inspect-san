using inspect_san.Models.Entities;
using inspect_san.Models.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace inspect_san.Models.Data;

/// <summary>
/// DbContext Inspect-San : métier (établissements → décisions) + Identity + journal/notifications.
/// </summary>
public class InspectSanDbContext : IdentityDbContext<ApplicationUser>
{
    /// <summary>Crée le contexte EF Core Inspect-San.</summary>
    public InspectSanDbContext(DbContextOptions<InspectSanDbContext> options) : base(options)
    {
    }

    public DbSet<Categorie> Categories => Set<Categorie>();
    public DbSet<Outil> Outils => Set<Outil>();
    public DbSet<Agent> Agents => Set<Agent>();
    public DbSet<Mission> Missions => Set<Mission>();
    public DbSet<MissionProduit> MissionProduits => Set<MissionProduit>();
    public DbSet<MissionOutil> MissionOutils => Set<MissionOutil>();
    public DbSet<Affectation> Affectations => Set<Affectation>();
    public DbSet<Produit> Produits => Set<Produit>();
    public DbSet<Ecole> Ecoles => Set<Ecole>();
    public DbSet<Chef> ChefEtablissements => Set<Chef>();
    public DbSet<Photo> Photos => Set<Photo>();
    public DbSet<Decision> Decisions => Set<Decision>();
    public DbSet<JournalEntry> JournalEntries => Set<JournalEntry>();
    public DbSet<NotificationItem> Notifications => Set<NotificationItem>();
    public DbSet<SousProvince> SousProvinces => Set<SousProvince>();

    /// <summary>Applique les configurations d’entités et les contraintes Identity.</summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(InspectSanDbContext).Assembly);

        modelBuilder.Entity<ApplicationUser>(b =>
        {
            b.Property(u => u.Nom).HasMaxLength(200).IsRequired();
            b.Property(u => u.Role).HasMaxLength(100);
            b.Property(u => u.Statut).HasMaxLength(40);
            b.Property(u => u.Telephone).HasMaxLength(40);
            b.Property(u => u.EcoleId).HasMaxLength(64);
            b.Property(u => u.AgentId).HasMaxLength(64);
            b.HasIndex(u => u.EcoleId);
            b.HasIndex(u => u.AgentId).IsUnique();
        });
    }
}
