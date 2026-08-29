using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class PrefetTableAndEcoleFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
CREATE TABLE IF NOT EXISTS `Prefet` (
    `Matricule` VARCHAR(64) CHARACTER SET utf8mb4 NOT NULL,
    `NomComplet` VARCHAR(200) CHARACTER SET utf8mb4 NOT NULL,
    `IdDinacope` VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    `Telephone` VARCHAR(40) CHARACTER SET utf8mb4 NOT NULL,
    `DateDebutAnciennete` DATETIME(6) NULL,
    PRIMARY KEY (`Matricule`),
    UNIQUE KEY `IX_Prefet_IdDinacope` (`IdDinacope`),
    KEY `IX_Prefet_NomComplet` (`NomComplet`)
) CHARACTER SET=utf8mb4;

-- Les anciennes valeurs texte libre ne sont plus valides comme FK
UPDATE `Etablissement` SET `MatriculeChef` = NULL;

ALTER TABLE `Etablissement`
    MODIFY `MatriculeChef` VARCHAR(64) CHARACTER SET utf8mb4 NULL;

CREATE INDEX `IX_Etablissement_MatriculeChef` ON `Etablissement` (`MatriculeChef`);

ALTER TABLE `Etablissement`
    ADD CONSTRAINT `FK_Etablissement_Prefet_MatriculeChef`
    FOREIGN KEY (`MatriculeChef`) REFERENCES `Prefet` (`Matricule`) ON DELETE SET NULL;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Prefet_MatriculeChef`;
DROP INDEX `IX_Etablissement_MatriculeChef` ON `Etablissement`;
DROP TABLE IF EXISTS `Prefet`;
ALTER TABLE `Etablissement`
    MODIFY `MatriculeChef` VARCHAR(50) CHARACTER SET utf8mb4 NULL;
");
        }
    }
}
