using System.Text.Json;
using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace inspect_san.Models.Data.Configurations;

internal static class JsonListConverter
{
    private static readonly JsonSerializerOptions Options = new();

    public static Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<List<string>, string> Create()
        => new(
            v => JsonSerializer.Serialize(v ?? new List<string>(), Options),
            v => string.IsNullOrWhiteSpace(v)
                ? new List<string>()
                : (JsonSerializer.Deserialize<List<string>>(v, Options) ?? new List<string>()));

    public static ValueComparer<List<string>> Comparer { get; } = new(
        (a, b) => (a ?? new List<string>()).SequenceEqual(b ?? new List<string>()),
        v => v.Aggregate(0, (h, s) => HashCode.Combine(h, s.GetHashCode())),
        v => v.ToList());
}

public class CommuneConfiguration : IEntityTypeConfiguration<Commune>
{
    public void Configure(EntityTypeBuilder<Commune> builder)
    {
        builder.ToTable("Communes");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasMaxLength(64);
        builder.Property(x => x.Nom).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Code).HasMaxLength(50);
        builder.HasIndex(x => x.Nom);
    }
}

public class RegimeConfiguration : IEntityTypeConfiguration<Regime>
{
    public void Configure(EntityTypeBuilder<Regime> builder)
    {
        builder.ToTable("Regimes");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasMaxLength(64);
        builder.Property(x => x.Nom).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Code).HasMaxLength(50);
        builder.HasIndex(x => x.Nom);
    }
}

public class TypeDecisionConfiguration : IEntityTypeConfiguration<TypeDecision>
{
    public void Configure(EntityTypeBuilder<TypeDecision> builder)
    {
        builder.ToTable("TypesDecision");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasMaxLength(64);
        builder.Property(x => x.Nom).HasMaxLength(150).IsRequired();
        builder.Property(x => x.Code).HasMaxLength(50);
        builder.Property(x => x.Libelle).HasMaxLength(200);
        builder.HasIndex(x => x.Nom);
        builder.HasIndex(x => x.Code);
    }
}

public class EquipeConfiguration : IEntityTypeConfiguration<Equipe>
{
    public void Configure(EntityTypeBuilder<Equipe> builder)
    {
        builder.ToTable("Equipes");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasMaxLength(64);
        builder.Property(x => x.Nom).HasMaxLength(150).IsRequired();
        builder.Property(x => x.ChefControleurId).HasMaxLength(64);
        builder.HasIndex(x => x.Nom);
        // Un contrôleur ne peut être chef que d’une équipe (plusieurs NULL autorisés en MySQL).
        builder.HasIndex(x => x.ChefControleurId).IsUnique();
        builder.HasOne(x => x.ChefControleur)
            .WithMany()
            .HasForeignKey(x => x.ChefControleurId)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
    }
}

public class ControleurConfiguration : IEntityTypeConfiguration<Controleur>
{
    public void Configure(EntityTypeBuilder<Controleur> builder)
    {
        builder.ToTable("Controleurs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasMaxLength(64);
        builder.Property(x => x.NomComplet).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Telephone).HasMaxLength(40);
        builder.Property(x => x.EquipeId).HasMaxLength(64).IsRequired();
        builder.HasIndex(x => x.EquipeId);
        builder.HasOne(x => x.Equipe)
            .WithMany(e => e.Controleurs)
            .HasForeignKey(x => x.EquipeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class EcoleConfiguration : IEntityTypeConfiguration<Ecole>
{
    public void Configure(EntityTypeBuilder<Ecole> builder)
    {
        builder.ToTable("Ecoles");
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasMaxLength(64);
        builder.Property(e => e.Denomination).HasMaxLength(250).IsRequired();
        builder.Property(e => e.RegimeId).HasMaxLength(64).IsRequired();
        builder.Property(e => e.CommuneId).HasMaxLength(64).IsRequired();
        builder.Property(e => e.IdDinacope).HasMaxLength(50).IsRequired();
        builder.Property(e => e.NumAgrement).HasMaxLength(100);
        builder.Property(e => e.NumNotification).HasMaxLength(100);
        builder.Property(e => e.Statut).HasMaxLength(50).IsRequired();

        builder.HasIndex(e => e.IdDinacope).IsUnique();
        builder.HasIndex(e => e.Statut);
        builder.HasIndex(e => e.RegimeId);
        builder.HasIndex(e => e.CommuneId);

        builder.OwnsOne(e => e.Adresse, a =>
        {
            a.Property(x => x.Quartier).HasMaxLength(120).HasColumnName("Adresse_Quartier");
            a.Property(x => x.Avenue).HasMaxLength(150).HasColumnName("Adresse_Avenue");
            a.Property(x => x.Numero).HasMaxLength(30).HasColumnName("Adresse_Numero");
        });

        builder.OwnsMany(e => e.Documents, d =>
        {
            d.ToTable("EcoleDocuments");
            d.WithOwner().HasForeignKey("EcoleId");
            d.Property<int>("Id");
            d.HasKey("Id");
            d.Property(x => x.Nom).HasMaxLength(250);
            d.Property(x => x.Taille).HasMaxLength(50);
            d.Property(x => x.Url).HasMaxLength(500);
            d.HasIndex("EcoleId");
        });

        builder.Navigation(e => e.Adresse).IsRequired();

        builder.HasOne(e => e.Regime)
            .WithMany(r => r.Ecoles)
            .HasForeignKey(e => e.RegimeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Commune)
            .WithMany(c => c.Ecoles)
            .HasForeignKey(e => e.CommuneId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ChefConfiguration : IEntityTypeConfiguration<Chef>
{
    public void Configure(EntityTypeBuilder<Chef> builder)
    {
        builder.ToTable("Chefs");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasMaxLength(64);
        builder.Property(c => c.NomComplet).HasMaxLength(200).IsRequired();
        builder.Property(c => c.IdDinacope).HasMaxLength(50);
        builder.Property(c => c.Telephone).HasMaxLength(40);
        builder.Property(c => c.EcoleId).HasMaxLength(64).IsRequired();

        builder.HasIndex(c => c.EcoleId);
        builder.HasIndex(c => c.IdDinacope);

        builder.HasOne(c => c.Ecole)
            .WithMany(e => e.Chefs)
            .HasForeignKey(c => c.EcoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class OrdreMissionConfiguration : IEntityTypeConfiguration<OrdreMission>
{
    public void Configure(EntityTypeBuilder<OrdreMission> builder)
    {
        builder.ToTable("OrdresMission");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Id).HasMaxLength(64);
        builder.Property(o => o.Numero).HasMaxLength(80).IsRequired();
        builder.Property(o => o.EcoleId).HasMaxLength(64).IsRequired();
        builder.Property(o => o.EquipeId).HasMaxLength(64).IsRequired();
        builder.Property(o => o.Statut).HasMaxLength(50).IsRequired();
        builder.Property(o => o.SignePar).HasMaxLength(64);
        builder.Property(o => o.Objet).HasMaxLength(500);

        builder.HasIndex(o => o.Numero).IsUnique();
        builder.HasIndex(o => o.EcoleId);
        builder.HasIndex(o => o.EquipeId);
        builder.HasIndex(o => o.Statut);
        builder.HasIndex(o => new { o.DebutValidite, o.FinValidite });

        builder.HasOne(o => o.Ecole)
            .WithMany(e => e.OrdresMission)
            .HasForeignKey(o => o.EcoleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Equipe)
            .WithMany(e => e.OrdresMission)
            .HasForeignKey(o => o.EquipeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class FicheControleConfiguration : IEntityTypeConfiguration<FicheControle>
{
    public void Configure(EntityTypeBuilder<FicheControle> builder)
    {
        builder.ToTable("FichesControle");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Id).HasMaxLength(64);
        builder.Property(f => f.Numero).HasMaxLength(80).IsRequired();
        builder.Property(f => f.OrdreMissionId).HasMaxLength(64).IsRequired();
        builder.Property(f => f.EcoleId).HasMaxLength(64).IsRequired();
        builder.Property(f => f.ChefId).HasMaxLength(64);
        builder.Property(f => f.Statut).HasMaxLength(50).IsRequired();
        builder.Property(f => f.ProduitsAutres).HasMaxLength(500);
        builder.Property(f => f.RecommandationPreliminaire).HasMaxLength(100);
        builder.Property(f => f.ValideePar).HasMaxLength(64);

        builder.HasIndex(f => f.Numero).IsUnique();
        builder.HasIndex(f => f.OrdreMissionId);
        builder.HasIndex(f => f.EcoleId);
        builder.HasIndex(f => f.ChefId);
        builder.HasIndex(f => f.Statut);
        builder.HasIndex(f => f.CreatedAt);

        builder.OwnsOne(f => f.SectionBatiments, s =>
        {
            s.Property(x => x.EtatGeneral).HasMaxLength(50).HasColumnName("Batiments_EtatGeneral");
            s.Property(x => x.NombreBatiments).HasColumnName("Batiments_NombreBatiments");
            s.Property(x => x.NombreEleves).HasColumnName("Batiments_NombreEleves");
            s.Property(x => x.ToilettesFilles).HasMaxLength(120).HasColumnName("Batiments_ToilettesFilles");
            s.Property(x => x.ToilettesGarcons).HasMaxLength(120).HasColumnName("Batiments_ToilettesGarcons");
        });

        builder.OwnsOne(f => f.SectionImpact7, s =>
        {
            s.Property(x => x.MontantPercu).HasMaxLength(80).HasColumnName("Impact7_MontantPercu");
            s.Property(x => x.Quantite).HasMaxLength(250).HasColumnName("Impact7_Quantite");
            s.Property(x => x.ProduitsNettoyage)
                .HasConversion(JsonListConverter.Create(), JsonListConverter.Comparer)
                .HasColumnType("longtext")
                .HasColumnName("Impact7_ProduitsJson");
        });

        builder.OwnsMany(f => f.Photos, p =>
        {
            p.ToTable("FichePhotos");
            p.WithOwner().HasForeignKey("FicheControleId");
            p.Property<int>("Id");
            p.HasKey("Id");
            p.Property(x => x.Nom).HasMaxLength(250);
            p.Property(x => x.Legende).HasMaxLength(250);
            p.Property(x => x.Url).HasMaxLength(500);
            p.HasIndex("FicheControleId");
        });

        builder.Navigation(f => f.SectionBatiments).IsRequired();
        builder.Navigation(f => f.SectionImpact7).IsRequired();

        builder.HasOne(f => f.OrdreMission)
            .WithMany(o => o.FichesControle)
            .HasForeignKey(f => f.OrdreMissionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(f => f.Ecole)
            .WithMany(e => e.FichesControle)
            .HasForeignKey(f => f.EcoleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(f => f.Chef)
            .WithMany(c => c.FichesControle)
            .HasForeignKey(f => f.ChefId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class RapportConfiguration : IEntityTypeConfiguration<Rapport>
{
    public void Configure(EntityTypeBuilder<Rapport> builder)
    {
        builder.ToTable("Rapports");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasMaxLength(64);
        builder.Property(r => r.Numero).HasMaxLength(80).IsRequired();
        builder.Property(r => r.EcoleId).HasMaxLength(64).IsRequired();
        builder.Property(r => r.Statut).HasMaxLength(50).IsRequired();
        builder.Property(r => r.DeposePar).HasMaxLength(64);
        builder.Property(r => r.AccusePar).HasMaxLength(64);
        builder.Property(r => r.Synthese).HasColumnType("longtext");

        builder.Property(r => r.FicheIds)
            .HasConversion(JsonListConverter.Create(), JsonListConverter.Comparer)
            .HasColumnType("longtext")
            .HasColumnName("FicheIdsJson");

        builder.HasIndex(r => r.Numero).IsUnique();
        builder.HasIndex(r => r.EcoleId);
        builder.HasIndex(r => r.Statut);
        builder.HasIndex(r => r.DeposeLe);

        builder.HasOne(r => r.Ecole)
            .WithMany(e => e.Rapports)
            .HasForeignKey(r => r.EcoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class RapportFicheConfiguration : IEntityTypeConfiguration<RapportFiche>
{
    public void Configure(EntityTypeBuilder<RapportFiche> builder)
    {
        builder.ToTable("RapportFiches");
        builder.HasKey(x => new { x.RapportId, x.FicheControleId });
        builder.Property(x => x.RapportId).HasMaxLength(64);
        builder.Property(x => x.FicheControleId).HasMaxLength(64);
        builder.HasIndex(x => x.FicheControleId);

        builder.HasOne(x => x.Rapport)
            .WithMany(r => r.RapportFiches)
            .HasForeignKey(x => x.RapportId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.FicheControle)
            .WithMany(f => f.RapportFiches)
            .HasForeignKey(x => x.FicheControleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class DecisionConfiguration : IEntityTypeConfiguration<Decision>
{
    public void Configure(EntityTypeBuilder<Decision> builder)
    {
        builder.ToTable("Decisions");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Id).HasMaxLength(64);
        builder.Property(d => d.Numero).HasMaxLength(80).IsRequired();
        builder.Property(d => d.RapportId).HasMaxLength(64).IsRequired();
        builder.Property(d => d.EcoleId).HasMaxLength(64).IsRequired();
        builder.Property(d => d.TypeDecisionId).HasMaxLength(64).IsRequired();
        builder.Property(d => d.DelaiExecution).HasMaxLength(100);
        builder.Property(d => d.StatutExecution).HasMaxLength(50).IsRequired();
        builder.Property(d => d.DecidePar).HasMaxLength(64);
        builder.Property(d => d.Motif).HasColumnType("longtext");
        builder.Property(d => d.Commentaire).HasColumnType("longtext");

        builder.HasIndex(d => d.Numero).IsUnique();
        builder.HasIndex(d => d.RapportId);
        builder.HasIndex(d => d.EcoleId);
        builder.HasIndex(d => d.TypeDecisionId);
        builder.HasIndex(d => d.StatutExecution);

        builder.HasOne(d => d.Rapport)
            .WithMany(r => r.Decisions)
            .HasForeignKey(d => d.RapportId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.Ecole)
            .WithMany(e => e.Decisions)
            .HasForeignKey(d => d.EcoleId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.TypeDecision)
            .WithMany(t => t.Decisions)
            .HasForeignKey(d => d.TypeDecisionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class JournalEntryConfiguration : IEntityTypeConfiguration<JournalEntry>
{
    public void Configure(EntityTypeBuilder<JournalEntry> builder)
    {
        builder.ToTable("JournalEntries");
        builder.HasKey(j => j.Id);
        builder.Property(j => j.Id).HasMaxLength(64);
        builder.Property(j => j.UtilisateurId).HasMaxLength(64).IsRequired();
        builder.Property(j => j.Module).HasMaxLength(100).IsRequired();
        builder.Property(j => j.Action).HasMaxLength(100).IsRequired();
        builder.Property(j => j.Detail).HasMaxLength(1000);
        builder.HasIndex(j => j.CreatedAt);
        builder.HasIndex(j => j.Module);
        builder.HasIndex(j => j.UtilisateurId);
    }
}

public class NotificationItemConfiguration : IEntityTypeConfiguration<NotificationItem>
{
    public void Configure(EntityTypeBuilder<NotificationItem> builder)
    {
        builder.ToTable("Notifications");
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id).HasMaxLength(64);
        builder.Property(n => n.Titre).HasMaxLength(200).IsRequired();
        builder.Property(n => n.Message).HasMaxLength(1000);
        builder.Property(n => n.UserId).HasMaxLength(64);
        builder.HasIndex(n => n.CreatedAt);
        builder.HasIndex(n => n.UserId);
        builder.HasIndex(n => n.Lu);
    }
}
