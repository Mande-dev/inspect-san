using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class RenamePrefetToChefEtablissement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // MariaDB : pas de RENAME INDEX (syntaxe MySQL récente).
            // Migration idempotente : gère aussi un état partiel (table déjà renommée).
            migrationBuilder.Sql(@"
-- FK éventuelle vers Prefet
SET @fk := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Etablissement'
    AND CONSTRAINT_NAME = 'FK_Etablissement_Prefet_MatriculeChef'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  LIMIT 1
);
SET @sql := IF(@fk IS NOT NULL,
  'ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Prefet_MatriculeChef`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Renommer Prefet → ChefEtablissement si besoin
SET @has_prefet := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet'
);
SET @has_chef := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement'
);
SET @sql := IF(@has_prefet > 0 AND @has_chef = 0,
  'RENAME TABLE `Prefet` TO `ChefEtablissement`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PK (peut avoir été droppée avant un échec)
SET @has_pk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'ChefEtablissement'
    AND CONSTRAINT_TYPE = 'PRIMARY KEY'
);
SET @sql := IF(@has_pk = 0,
  'ALTER TABLE `ChefEtablissement` ADD PRIMARY KEY (`Matricule`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Indexes : DROP + CREATE (compatible MariaDB)
SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement' AND INDEX_NAME = 'IX_Prefet_NomComplet'
  LIMIT 1
);
SET @sql := IF(@idx IS NOT NULL,
  'ALTER TABLE `ChefEtablissement` DROP INDEX `IX_Prefet_NomComplet`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement' AND INDEX_NAME = 'IX_ChefEtablissement_NomComplet'
  LIMIT 1
);
SET @sql := IF(@idx IS NULL,
  'CREATE INDEX `IX_ChefEtablissement_NomComplet` ON `ChefEtablissement` (`NomComplet`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement' AND INDEX_NAME = 'IX_Prefet_IdDinacope'
  LIMIT 1
);
SET @sql := IF(@idx IS NOT NULL,
  'ALTER TABLE `ChefEtablissement` DROP INDEX `IX_Prefet_IdDinacope`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement' AND INDEX_NAME = 'IX_ChefEtablissement_IdDinacope'
  LIMIT 1
);
SET @sql := IF(@idx IS NULL,
  'CREATE UNIQUE INDEX `IX_ChefEtablissement_IdDinacope` ON `ChefEtablissement` (`IdDinacope`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- FK Etablissement → ChefEtablissement
SET @fk := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Etablissement'
    AND CONSTRAINT_NAME = 'FK_Etablissement_ChefEtablissement_MatriculeChef'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  LIMIT 1
);
SET @sql := IF(@fk IS NULL,
  'ALTER TABLE `Etablissement` ADD CONSTRAINT `FK_Etablissement_ChefEtablissement_MatriculeChef` FOREIGN KEY (`MatriculeChef`) REFERENCES `ChefEtablissement` (`Matricule`) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
SET @fk := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Etablissement'
    AND CONSTRAINT_NAME = 'FK_Etablissement_ChefEtablissement_MatriculeChef'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  LIMIT 1
);
SET @sql := IF(@fk IS NOT NULL,
  'ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_ChefEtablissement_MatriculeChef`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_chef := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ChefEtablissement'
);
SET @has_prefet := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet'
);
SET @sql := IF(@has_chef > 0 AND @has_prefet = 0,
  'RENAME TABLE `ChefEtablissement` TO `Prefet`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet' AND INDEX_NAME = 'IX_ChefEtablissement_NomComplet'
  LIMIT 1
);
SET @sql := IF(@idx IS NOT NULL,
  'ALTER TABLE `Prefet` DROP INDEX `IX_ChefEtablissement_NomComplet`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet' AND INDEX_NAME = 'IX_Prefet_NomComplet'
  LIMIT 1
);
SET @sql := IF(@idx IS NULL,
  'CREATE INDEX `IX_Prefet_NomComplet` ON `Prefet` (`NomComplet`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet' AND INDEX_NAME = 'IX_ChefEtablissement_IdDinacope'
  LIMIT 1
);
SET @sql := IF(@idx IS NOT NULL,
  'ALTER TABLE `Prefet` DROP INDEX `IX_ChefEtablissement_IdDinacope`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx := (
  SELECT INDEX_NAME FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Prefet' AND INDEX_NAME = 'IX_Prefet_IdDinacope'
  LIMIT 1
);
SET @sql := IF(@idx IS NULL,
  'CREATE UNIQUE INDEX `IX_Prefet_IdDinacope` ON `Prefet` (`IdDinacope`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @has_pk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Prefet'
    AND CONSTRAINT_TYPE = 'PRIMARY KEY'
);
SET @sql := IF(@has_pk = 0,
  'ALTER TABLE `Prefet` ADD PRIMARY KEY (`Matricule`)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @fk := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Etablissement'
    AND CONSTRAINT_NAME = 'FK_Etablissement_Prefet_MatriculeChef'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  LIMIT 1
);
SET @sql := IF(@fk IS NULL,
  'ALTER TABLE `Etablissement` ADD CONSTRAINT `FK_Etablissement_Prefet_MatriculeChef` FOREIGN KEY (`MatriculeChef`) REFERENCES `Prefet` (`Matricule`) ON DELETE SET NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
");
        }
    }
}
