using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class CodesAsAutoIncrementPk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Dev-friendly rebuild: codes string (+ Id) → Code* int AUTO_INCREMENT as PK.
            migrationBuilder.Sql(@"
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_ProduitUtilise_CodeProduit`;
ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_OutilUtilise_CodeOutil`;
ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Categories_CodeCategories`;

DELETE FROM `Decision`;
DELETE FROM `Affectation`;
DELETE FROM `Photos`;
DELETE FROM `Mission`;
DELETE FROM `Etablissement`;

DROP TABLE IF EXISTS `ProduitUtilise`;
CREATE TABLE `ProduitUtilise` (
    `CodeProduit` INT NOT NULL AUTO_INCREMENT,
    `LibeleProduit` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`CodeProduit`),
    KEY `IX_ProduitUtilise_LibeleProduit` (`LibeleProduit`)
) CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `OutilUtilise`;
CREATE TABLE `OutilUtilise` (
    `CodeOutile` INT NOT NULL AUTO_INCREMENT,
    `LibelleOutile` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`CodeOutile`)
) CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories` (
    `CodeCategories` INT NOT NULL AUTO_INCREMENT,
    `Designation` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`CodeCategories`)
) CHARACTER SET=utf8mb4;

ALTER TABLE `Mission` MODIFY `CodeProduit` INT NULL;
ALTER TABLE `Mission` MODIFY `CodeOutil` INT NULL;
ALTER TABLE `Etablissement` MODIFY `CodeCategories` INT NOT NULL;

ALTER TABLE `Mission`
    ADD CONSTRAINT `FK_Mission_ProduitUtilise_CodeProduit`
    FOREIGN KEY (`CodeProduit`) REFERENCES `ProduitUtilise` (`CodeProduit`) ON DELETE SET NULL;

ALTER TABLE `Mission`
    ADD CONSTRAINT `FK_Mission_OutilUtilise_CodeOutil`
    FOREIGN KEY (`CodeOutil`) REFERENCES `OutilUtilise` (`CodeOutile`) ON DELETE SET NULL;

ALTER TABLE `Etablissement`
    ADD CONSTRAINT `FK_Etablissement_Categories_CodeCategories`
    FOREIGN KEY (`CodeCategories`) REFERENCES `Categories` (`CodeCategories`) ON DELETE RESTRICT;

SET FOREIGN_KEY_CHECKS = 1;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_ProduitUtilise_CodeProduit`;
ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_OutilUtilise_CodeOutil`;
ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Categories_CodeCategories`;

DELETE FROM `Decision`;
DELETE FROM `Affectation`;
DELETE FROM `Photos`;
DELETE FROM `Mission`;
DELETE FROM `Etablissement`;

DROP TABLE IF EXISTS `ProduitUtilise`;
CREATE TABLE `ProduitUtilise` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `CodeProduit` VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    `LibeleProduit` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_ProduitUtilise_CodeProduit` (`CodeProduit`),
    KEY `IX_ProduitUtilise_LibeleProduit` (`LibeleProduit`)
) CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `OutilUtilise`;
CREATE TABLE `OutilUtilise` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `CodeOutile` VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    `LibelleOutile` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_OutilUtilise_CodeOutile` (`CodeOutile`)
) CHARACTER SET=utf8mb4;

DROP TABLE IF EXISTS `Categories`;
CREATE TABLE `Categories` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `CodeCategories` VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL,
    `Designation` VARCHAR(150) CHARACTER SET utf8mb4 NOT NULL,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Categories_CodeCategories` (`CodeCategories`)
) CHARACTER SET=utf8mb4;

ALTER TABLE `Mission` MODIFY `CodeProduit` VARCHAR(50) CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Mission` MODIFY `CodeOutil` VARCHAR(50) CHARACTER SET utf8mb4 NULL;
ALTER TABLE `Etablissement` MODIFY `CodeCategories` VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL;

ALTER TABLE `Mission`
    ADD CONSTRAINT `FK_Mission_ProduitUtilise_CodeProduit`
    FOREIGN KEY (`CodeProduit`) REFERENCES `ProduitUtilise` (`CodeProduit`) ON DELETE SET NULL;

ALTER TABLE `Mission`
    ADD CONSTRAINT `FK_Mission_OutilUtilise_CodeOutil`
    FOREIGN KEY (`CodeOutil`) REFERENCES `OutilUtilise` (`CodeOutile`) ON DELETE SET NULL;

ALTER TABLE `Etablissement`
    ADD CONSTRAINT `FK_Etablissement_Categories_CodeCategories`
    FOREIGN KEY (`CodeCategories`) REFERENCES `Categories` (`CodeCategories`) ON DELETE RESTRICT;

SET FOREIGN_KEY_CHECKS = 1;
");
        }
    }
}
