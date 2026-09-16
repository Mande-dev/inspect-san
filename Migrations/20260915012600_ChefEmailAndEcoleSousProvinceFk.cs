using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class ChefEmailAndEcoleSousProvinceFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Email chef (idempotent si déjà présent)
            migrationBuilder.Sql("""
                SET @col := (
                  SELECT COUNT(*) FROM information_schema.COLUMNS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'ChefEtablissement'
                    AND COLUMN_NAME = 'Email'
                );
                SET @sql := IF(@col = 0,
                  'ALTER TABLE `ChefEtablissement` ADD COLUMN `Email` varchar(200) NULL',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);

            // Garantir les sous-provinces du catalogue avant la FK
            migrationBuilder.Sql("""
                INSERT IGNORE INTO `SousProvince` (`Code`, `Libelle`) VALUES
                ('SP001', 'Kinsenso 1'),
                ('SP002', 'Kinsenso 2'),
                ('SP003', 'Lemba 1'),
                ('SP004', 'Lemba 2'),
                ('SP005', 'Limete 1'),
                ('SP006', 'Limete 2'),
                ('SP007', 'Limete 3'),
                ('SP008', 'Matete 1'),
                ('SP009', 'Matete 2'),
                ('SP010', 'Ngaba');
                """);

            // Normaliser d'anciens codes legacy éventuels
            migrationBuilder.Sql("""
                UPDATE `Etablissement` SET `SousDivision` = 'SP001' WHERE `SousDivision` IN ('kinsenso_1', 'Kinsenso 1');
                UPDATE `Etablissement` SET `SousDivision` = 'SP002' WHERE `SousDivision` IN ('kinsenso_2', 'Kinsenso 2');
                UPDATE `Etablissement` SET `SousDivision` = 'SP003' WHERE `SousDivision` IN ('lemba_1', 'Lemba 1');
                UPDATE `Etablissement` SET `SousDivision` = 'SP004' WHERE `SousDivision` IN ('lemba_2', 'Lemba 2');
                UPDATE `Etablissement` SET `SousDivision` = 'SP005' WHERE `SousDivision` IN ('limete_1', 'Limete 1');
                UPDATE `Etablissement` SET `SousDivision` = 'SP006' WHERE `SousDivision` IN ('limete_2', 'Limete 2');
                UPDATE `Etablissement` SET `SousDivision` = 'SP007' WHERE `SousDivision` IN ('limete_3', 'Limete 3');
                UPDATE `Etablissement` SET `SousDivision` = 'SP008' WHERE `SousDivision` IN ('matete_1', 'Matete 1');
                UPDATE `Etablissement` SET `SousDivision` = 'SP009' WHERE `SousDivision` IN ('matete_2', 'Matete 2');
                UPDATE `Etablissement` SET `SousDivision` = 'SP010' WHERE `SousDivision` IN ('ngaba', 'Ngaba');
                """);

            // Index + FK Etablissement → SousProvince (si absents)
            migrationBuilder.Sql("""
                SET @idx := (
                  SELECT COUNT(*) FROM information_schema.STATISTICS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'Etablissement'
                    AND INDEX_NAME = 'IX_Etablissement_SousDivision'
                );
                SET @sql := IF(@idx = 0,
                  'CREATE INDEX `IX_Etablissement_SousDivision` ON `Etablissement` (`SousDivision`)',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

                SET @fk := (
                  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'Etablissement'
                    AND CONSTRAINT_NAME = 'FK_Etablissement_SousProvince_SousDivision'
                    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                );
                SET @sql := IF(@fk = 0,
                  'ALTER TABLE `Etablissement` ADD CONSTRAINT `FK_Etablissement_SousProvince_SousDivision` FOREIGN KEY (`SousDivision`) REFERENCES `SousProvince` (`Code`) ON DELETE RESTRICT',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                SET @fk := (
                  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'Etablissement'
                    AND CONSTRAINT_NAME = 'FK_Etablissement_SousProvince_SousDivision'
                    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                );
                SET @sql := IF(@fk > 0,
                  'ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_SousProvince_SousDivision`',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

                SET @idx := (
                  SELECT COUNT(*) FROM information_schema.STATISTICS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'Etablissement'
                    AND INDEX_NAME = 'IX_Etablissement_SousDivision'
                );
                SET @sql := IF(@idx > 0,
                  'DROP INDEX `IX_Etablissement_SousDivision` ON `Etablissement`',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

                SET @col := (
                  SELECT COUNT(*) FROM information_schema.COLUMNS
                  WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_NAME = 'ChefEtablissement'
                    AND COLUMN_NAME = 'Email'
                );
                SET @sql := IF(@col > 0,
                  'ALTER TABLE `ChefEtablissement` DROP COLUMN `Email`',
                  'SELECT 1');
                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                """);
        }
    }
}
