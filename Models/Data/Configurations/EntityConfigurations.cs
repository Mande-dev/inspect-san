using inspect_san.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace inspect_san.Models.Data.Configurations;

/// <summary>Configuration EF Core de <see cref="Categorie"/>.</summary>
public class CategorieConfiguration : IEntityTypeConfiguration<Categorie>
{
    /// <summary>Mappe la table Categories.</summary>
    public void Configure(EntityTypeBuilder<Categorie> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(x => x.CodeCategories);
        builder.Property(x => x.CodeCategories).ValueGeneratedOnAdd();
        builder.Property(x => x.Designation).HasMaxLength(150).IsRequired();
    }
}

/// <summary>Configuration EF Core de <see cref="Outil"/>.</summary>
public class OutilConfiguration : IEntityTypeConfiguration<Outil>
{
    /// <summary>Mappe la table OutilUtilise.</summary>
    public void Configure(EntityTypeBuilder<Outil> builder)
    {
        builder.ToTable("OutilUtilise");
        builder.HasKey(x => x.CodeOutile);
        builder.Property(x => x.CodeOutile).ValueGeneratedOnAdd();
        builder.Property(x => x.LibelleOutile).HasMaxLength(150).IsRequired();
    }
}

/// <summary>Configuration EF Core de <see cref="Agent"/>.</summary>
public class AgentConfiguration : IEntityTypeConfiguration<Agent>
{
    /// <summary>Mappe la table Agents.</summary>
    public void Configure(EntityTypeBuilder<Agent> builder)
    {
        builder.ToTable("Agents");
        builder.HasKey(x => x.MatrAgent);
        builder.Property(x => x.MatrAgent).HasMaxLength(64);
        builder.Property(x => x.NomAgent).HasMaxLength(200).IsRequired();
        builder.Property(x => x.TelAgent).HasMaxLength(40);
        builder.Property(x => x.Actif).HasDefaultValue(true);
        builder.HasIndex(x => x.NomAgent);
        builder.HasIndex(x => x.Actif);
    }
}

/// <summary>Configuration EF Core de <see cref="Mission"/>.</summary>
public class MissionConfiguration : IEntityTypeConfiguration<Mission>
{
    /// <summary>Mappe la table Mission, relations et propriétés ignorées.</summary>
    public void Configure(EntityTypeBuilder<Mission> builder)
    {
        builder.ToTable("Mission");
        builder.HasKey(x => x.NumOrdre);
        builder.Property(x => x.NumOrdre).HasMaxLength(80);
        builder.Property(x => x.Id).HasMaxLength(64).IsRequired();
        builder.HasIndex(x => x.Id).IsUnique();
        builder.Property(x => x.EtatBatiment).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Validite).HasMaxLength(50);
        builder.Property(x => x.NumAgrement).HasMaxLength(100).IsRequired();
        builder.Property(x => x.StatutFiche).HasMaxLength(50);
        builder.Property(x => x.NomEquipe).HasMaxLength(150);
        builder.Property(x => x.Objet).HasMaxLength(500);
        builder.Property(x => x.SignePar).HasMaxLength(64);
        builder.Property(x => x.OmEnvoyeA).HasMaxLength(200);
        builder.Property(x => x.ProduitsAutres).HasMaxLength(200);
        builder.Property(x => x.OutilsAutres).HasMaxLength(200);
        builder.Property(x => x.RecommandationPreliminaire).HasMaxLength(100);
        builder.Property(x => x.ValideePar).HasMaxLength(64);
        builder.Property(x => x.MontPer).HasPrecision(18, 2);
        builder.Property(x => x.RapportEquipeDeposePar).HasMaxLength(64);
        builder.Property(x => x.RapportSecretariatDeposePar).HasMaxLength(64);
        builder.Property(x => x.RapportClosPar).HasMaxLength(64);
        builder.Property(x => x.RapportClos).HasDefaultValue(false);

        builder.HasIndex(x => x.NumAgrement);
        builder.HasIndex(x => x.Validite);
        builder.HasIndex(x => x.DateFin);

        builder.HasOne(x => x.Ecole)
            .WithMany(e => e.Missions)
            .HasForeignKey(x => x.NumAgrement)
            .HasPrincipalKey(e => e.NumAgrement)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Produit)
            .WithMany(p => p.Missions)
            .HasForeignKey(x => x.CodeProduit)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(x => x.Outil)
            .WithMany(o => o.Missions)
            .HasForeignKey(x => x.CodeOutil)
            .HasPrincipalKey(o => o.CodeOutile)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Ignore(x => x.Statut);
        builder.Ignore(x => x.Numero);
        builder.Ignore(x => x.EcoleId);
        builder.Ignore(x => x.DateEmission);
        builder.Ignore(x => x.FinValidite);
        builder.Ignore(x => x.NombreBatiments);
        builder.Ignore(x => x.EtatGeneral);
        builder.Ignore(x => x.NombreEleves);
        builder.Ignore(x => x.ToilettesFilles);
        builder.Ignore(x => x.ToilettesGarcons);
        builder.Ignore(x => x.Observations);
    }
}

/// <summary>Configuration EF Core de <see cref="Affectation"/>.</summary>
public class AffectationConfiguration : IEntityTypeConfiguration<Affectation>
{
    /// <summary>Mappe la table Affectation et ses relations.</summary>
    public void Configure(EntityTypeBuilder<Affectation> builder)
    {
        builder.ToTable("Affectation");
        builder.HasKey(x => x.IdAffectation);
        builder.Property(x => x.IdAffectation).ValueGeneratedOnAdd();
        builder.Property(x => x.NomOrdre).HasMaxLength(80).IsRequired();
        builder.Property(x => x.MatrAgent).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Fonction).HasMaxLength(50).IsRequired();
        builder.Property(x => x.EcritureDeleguee).HasDefaultValue(false);

        builder.HasIndex(x => new { x.NomOrdre, x.MatrAgent }).IsUnique();
        builder.HasIndex(x => x.MatrAgent);

        builder.HasOne(x => x.Mission)
            .WithMany(m => m.Affectations)
            .HasForeignKey(x => x.NomOrdre)
            .HasPrincipalKey(m => m.NumOrdre)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Agent)
            .WithMany(a => a.Affectations)
            .HasForeignKey(x => x.MatrAgent)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

/// <summary>Configuration EF Core de <see cref="MissionProduit"/>.</summary>
public class MissionProduitConfiguration : IEntityTypeConfiguration<MissionProduit>
{
    /// <summary>Mappe la table MissionProduit et ses relations.</summary>
    public void Configure(EntityTypeBuilder<MissionProduit> builder)
    {
        builder.ToTable("MissionProduit");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.NumOrdre).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => new { x.NumOrdre, x.CodeProduit }).IsUnique();
        builder.HasIndex(x => x.CodeProduit);

        builder.HasOne(x => x.Mission)
            .WithMany(m => m.MissionProduits)
            .HasForeignKey(x => x.NumOrdre)
            .HasPrincipalKey(m => m.NumOrdre)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Produit)
            .WithMany(p => p.MissionProduits)
            .HasForeignKey(x => x.CodeProduit)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

/// <summary>Configuration EF Core de <see cref="MissionOutil"/>.</summary>
public class MissionOutilConfiguration : IEntityTypeConfiguration<MissionOutil>
{
    /// <summary>Mappe la table MissionOutil et ses relations.</summary>
    public void Configure(EntityTypeBuilder<MissionOutil> builder)
    {
        builder.ToTable("MissionOutil");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.NumOrdre).HasMaxLength(80).IsRequired();
        builder.HasIndex(x => new { x.NumOrdre, x.CodeOutil }).IsUnique();
        builder.HasIndex(x => x.CodeOutil);

        builder.HasOne(x => x.Mission)
            .WithMany(m => m.MissionOutils)
            .HasForeignKey(x => x.NumOrdre)
            .HasPrincipalKey(m => m.NumOrdre)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Outil)
            .WithMany(o => o.MissionOutils)
            .HasForeignKey(x => x.CodeOutil)
            .HasPrincipalKey(o => o.CodeOutile)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

/// <summary>Configuration EF Core de <see cref="Produit"/>.</summary>
public class ProduitConfiguration : IEntityTypeConfiguration<Produit>
{
    /// <summary>Mappe la table ProduitUtilise.</summary>
    public void Configure(EntityTypeBuilder<Produit> builder)
    {
        builder.ToTable("ProduitUtilise");
        builder.HasKey(x => x.CodeProduit);
        builder.Property(x => x.CodeProduit).ValueGeneratedOnAdd();
        builder.Property(x => x.LibeleProduit).HasMaxLength(150).IsRequired();
        builder.HasIndex(x => x.LibeleProduit);
    }
}

/// <summary>Configuration EF Core de <see cref="Photo"/>.</summary>
public class PhotoConfiguration : IEntityTypeConfiguration<Photo>
{
    /// <summary>Mappe la table Photos liée aux missions.</summary>
    public void Configure(EntityTypeBuilder<Photo> builder)
    {
        builder.ToTable("Photos");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.FicheControleId).HasMaxLength(64).IsRequired();
        builder.Property(x => x.Nom).HasMaxLength(250);
        builder.Property(x => x.Legende).HasMaxLength(250);
        builder.Property(x => x.Url).HasMaxLength(500);
        builder.HasIndex(x => x.FicheControleId);

        builder.HasOne(x => x.Mission)
            .WithMany(m => m.Photos)
            .HasForeignKey(x => x.FicheControleId)
            .HasPrincipalKey(m => m.Id)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

/// <summary>Configuration EF Core de <see cref="Ecole"/>.</summary>
public class EcoleConfiguration : IEntityTypeConfiguration<Ecole>
{
    /// <summary>Mappe la table Etablissement et ses relations.</summary>
    public void Configure(EntityTypeBuilder<Ecole> builder)
    {
        builder.ToTable("Etablissement");
        builder.HasKey(e => e.NumAgrement);
        builder.Property(e => e.NumAgrement).HasMaxLength(100);
        builder.Property(e => e.Id).HasMaxLength(64).IsRequired();
        builder.HasIndex(e => e.Id).IsUnique();
        builder.Property(e => e.Denomination).HasMaxLength(250).IsRequired();
        builder.Property(e => e.IdDinacope).HasColumnName("IDDinacope").HasMaxLength(50).IsRequired();
        builder.Property(e => e.RegGes).HasMaxLength(50).IsRequired();
        builder.Property(e => e.SousDivision).HasMaxLength(50).IsRequired();
        builder.Property(e => e.NumNotification).HasMaxLength(100);
        builder.Property(e => e.Adresse).HasColumnName("AdresseEtablissement").HasMaxLength(500).IsRequired();
        builder.Property(e => e.MatriculeChef).HasMaxLength(64);

        builder.HasIndex(e => e.IdDinacope).IsUnique();

        builder.HasOne(e => e.Categorie)
            .WithMany(c => c.Ecoles)
            .HasForeignKey(e => e.CodeCategories)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.SousProvince)
            .WithMany()
            .HasForeignKey(e => e.SousDivision)
            .HasPrincipalKey(s => s.Code)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.ChefEtablissement)
            .WithMany(p => p.Ecoles)
            .HasForeignKey(e => e.MatriculeChef)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

/// <summary>Configuration EF Core de <see cref="Chef"/>.</summary>
public class ChefEtablissementConfiguration : IEntityTypeConfiguration<Chef>
{
    /// <summary>Mappe la table ChefEtablissement.</summary>
    public void Configure(EntityTypeBuilder<Chef> builder)
    {
        builder.ToTable("ChefEtablissement");
        builder.HasKey(x => x.Matricule);
        builder.Property(x => x.Matricule).HasMaxLength(64);
        builder.Property(x => x.NomComplet).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Telephone).HasMaxLength(40);
        builder.Property(x => x.Email).HasMaxLength(200);
        builder.HasIndex(x => x.NomComplet);
        builder.Ignore(x => x.Id);
    }
}

/// <summary>Configuration EF Core de <see cref="Decision"/>.</summary>
public class DecisionConfiguration : IEntityTypeConfiguration<Decision>
{
    /// <summary>Mappe la table Decision, relations et propriétés ignorées.</summary>
    public void Configure(EntityTypeBuilder<Decision> builder)
    {
        builder.ToTable("Decision");
        builder.HasKey(d => d.NumDecision);
        builder.Property(d => d.NumDecision).HasMaxLength(80);
        builder.Property(d => d.DecisionFin).HasMaxLength(50).IsRequired();
        builder.Property(d => d.NumOrdre).HasMaxLength(80).IsRequired();
        builder.Property(d => d.NumAgrement).HasMaxLength(100).IsRequired();
        builder.Property(d => d.LdEnvoyeA).HasMaxLength(200);

        builder.HasIndex(d => d.NumOrdre);
        builder.HasIndex(d => d.NumAgrement);

        builder.HasOne(d => d.Mission)
            .WithMany(m => m.Decisions)
            .HasForeignKey(d => d.NumOrdre)
            .HasPrincipalKey(m => m.NumOrdre)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(d => d.Ecole)
            .WithMany(e => e.Decisions)
            .HasForeignKey(d => d.NumAgrement)
            .HasPrincipalKey(e => e.NumAgrement)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Ignore(d => d.Id);
        builder.Ignore(d => d.Numero);
        builder.Ignore(d => d.TypeDecision);
        builder.Ignore(d => d.FicheControleId);
        builder.Ignore(d => d.EcoleId);
        builder.Ignore(d => d.DecidePar);
        builder.Ignore(d => d.DecideLe);
        builder.Ignore(d => d.CreatedAt);
        builder.Ignore(d => d.FicheControle);
    }
}

/// <summary>Configuration EF Core de <see cref="JournalEntry"/>.</summary>
public class JournalEntryConfiguration : IEntityTypeConfiguration<JournalEntry>
{
    /// <summary>Mappe la table JournalEntries.</summary>
    public void Configure(EntityTypeBuilder<JournalEntry> builder)
    {
        builder.ToTable("JournalEntries");
        builder.HasKey(j => j.Id);
        builder.Property(j => j.Id).HasMaxLength(64);
        builder.Property(j => j.UtilisateurId).HasMaxLength(64).IsRequired();
        builder.Property(j => j.Module).HasMaxLength(100).IsRequired();
        builder.Property(j => j.Action).HasMaxLength(100).IsRequired();
        builder.Property(j => j.Detail).HasMaxLength(2000);
        builder.HasIndex(j => j.CreatedAt);
    }
}

/// <summary>Configuration EF Core de <see cref="NotificationItem"/>.</summary>
public class NotificationItemConfiguration : IEntityTypeConfiguration<NotificationItem>
{
    /// <summary>Mappe la table Notifications.</summary>
    public void Configure(EntityTypeBuilder<NotificationItem> builder)
    {
        builder.ToTable("Notifications");
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id).HasMaxLength(64);
        builder.Property(n => n.Titre).HasMaxLength(200).IsRequired();
        builder.Property(n => n.Message).HasMaxLength(2000);
        builder.Property(n => n.UserId).HasMaxLength(64);
        builder.HasIndex(n => n.UserId);
        builder.HasIndex(n => n.CreatedAt);
    }
}

/// <summary>Configuration EF Core de <see cref="SousProvince"/>.</summary>
public class SousProvinceConfiguration : IEntityTypeConfiguration<SousProvince>
{
    /// <summary>Mappe la table SousProvince.</summary>
    public void Configure(EntityTypeBuilder<SousProvince> builder)
    {
        builder.ToTable("SousProvince");
        builder.HasKey(x => x.Code);
        builder.Property(x => x.Code).HasMaxLength(10);
        builder.Property(x => x.Libelle).HasMaxLength(120).IsRequired();
        builder.HasIndex(x => x.Libelle).IsUnique();
    }
}
