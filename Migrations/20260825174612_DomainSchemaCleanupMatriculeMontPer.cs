using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class DomainSchemaCleanupMatriculeMontPer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnneeDebutActivite",
                table: "ChefEtablissement",
                type: "int",
                nullable: true);

            // Conserver l'année à partir de l'ancienne date d'ancienneté
            migrationBuilder.Sql("""
                UPDATE `ChefEtablissement`
                SET `AnneeDebutActivite` = YEAR(`DateDebutAnciennete`)
                WHERE `DateDebutAnciennete` IS NOT NULL;
                """);

            migrationBuilder.Sql("""
                UPDATE `Affectation`
                SET `Fonction` = 'chef_equipe'
                WHERE `Fonction` = 'chef_mission';
                """);

            migrationBuilder.Sql("""
                UPDATE `Decision`
                SET `DecisionFin` = CASE
                    WHEN `DecisionFin` IN ('maintien', 'avertissement') THEN 'suspension_temporaire_chef'
                    WHEN `DecisionFin` = 'fermeture_definitive' THEN 'fermeture_temporaire'
                    WHEN `DecisionFin` = 'rehabilitation' THEN 'rehabilitation'
                    WHEN `DecisionFin` = 'fermeture_temporaire' THEN 'fermeture_temporaire'
                    ELSE 'rehabilitation'
                END;
                """);

            // Catégories : aligner / compléter le référentiel
            migrationBuilder.Sql("""
                UPDATE `Categories` SET `Designation` = 'Collège' WHERE `Designation` = 'Primaire';
                UPDATE `Categories` SET `Designation` = 'Lycée' WHERE `Designation` = 'Secondaire';
                UPDATE `Categories` SET `Designation` = 'École' WHERE `Designation` = 'Maternelle';
                INSERT INTO `Categories` (`Designation`)
                SELECT v.d FROM (
                    SELECT 'Complexe scolaire' AS d UNION ALL
                    SELECT 'Groupe scolaire' UNION ALL
                    SELECT 'EP' UNION ALL
                    SELECT 'Institut'
                ) v
                WHERE NOT EXISTS (
                    SELECT 1 FROM `Categories` c WHERE c.`Designation` = v.d
                );
                """);

            migrationBuilder.Sql("""
                SET @idx := (
                  SELECT INDEX_NAME FROM information_schema.STATISTICS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'ChefEtablissement'
                    AND INDEX_NAME = 'IX_ChefEtablissement_IdDinacope'
                  LIMIT 1
                );
                SET @sql := IF(@idx IS NOT NULL,
                  'ALTER TABLE `ChefEtablissement` DROP INDEX `IX_ChefEtablissement_IdDinacope`',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            migrationBuilder.DropColumn(
                name: "EtatToilettes",
                table: "Mission");

            migrationBuilder.DropColumn(
                name: "DateDebutAnciennete",
                table: "ChefEtablissement");

            migrationBuilder.DropColumn(
                name: "IdDinacope",
                table: "ChefEtablissement");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EtatToilettes",
                table: "Mission",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateDebutAnciennete",
                table: "ChefEtablissement",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IdDinacope",
                table: "ChefEtablissement",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql("""
                UPDATE `ChefEtablissement`
                SET `DateDebutAnciennete` = STR_TO_DATE(CONCAT(`AnneeDebutActivite`, '-01-01'), '%Y-%m-%d')
                WHERE `AnneeDebutActivite` IS NOT NULL;
                UPDATE `ChefEtablissement`
                SET `IdDinacope` = CONCAT('DIN-', `Matricule`)
                WHERE `IdDinacope` = '' OR `IdDinacope` IS NULL;
                UPDATE `Affectation`
                SET `Fonction` = 'chef_mission'
                WHERE `Fonction` = 'chef_equipe';
                """);

            migrationBuilder.DropColumn(
                name: "AnneeDebutActivite",
                table: "ChefEtablissement");

            migrationBuilder.CreateIndex(
                name: "IX_ChefEtablissement_IdDinacope",
                table: "ChefEtablissement",
                column: "IdDinacope",
                unique: true);
        }
    }
}
