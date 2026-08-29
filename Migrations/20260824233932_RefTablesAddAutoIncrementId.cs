using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class RefTablesAddAutoIncrementId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop FKs that reference Code* as PK before changing primary keys
            migrationBuilder.Sql("ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_ProduitUtilise_CodeProduit`;");
            migrationBuilder.Sql("ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_OutilUtilise_CodeOutil`;");
            migrationBuilder.Sql("ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Categories_CodeCategories`;");

            migrationBuilder.Sql(@"
                ALTER TABLE `ProduitUtilise` DROP PRIMARY KEY;
                ALTER TABLE `ProduitUtilise` ADD COLUMN `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
                ALTER TABLE `ProduitUtilise` ADD UNIQUE INDEX `IX_ProduitUtilise_CodeProduit` (`CodeProduit`);
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE `OutilUtilise` DROP PRIMARY KEY;
                ALTER TABLE `OutilUtilise` ADD COLUMN `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
                ALTER TABLE `OutilUtilise` ADD UNIQUE INDEX `IX_OutilUtilise_CodeOutile` (`CodeOutile`);
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE `Categories` DROP PRIMARY KEY;
                ALTER TABLE `Categories` ADD COLUMN `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;
                ALTER TABLE `Categories` ADD UNIQUE INDEX `IX_Categories_CodeCategories` (`CodeCategories`);
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE `Mission`
                    ADD CONSTRAINT `FK_Mission_ProduitUtilise_CodeProduit`
                    FOREIGN KEY (`CodeProduit`) REFERENCES `ProduitUtilise` (`CodeProduit`) ON DELETE SET NULL;
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `Mission`
                    ADD CONSTRAINT `FK_Mission_OutilUtilise_CodeOutil`
                    FOREIGN KEY (`CodeOutil`) REFERENCES `OutilUtilise` (`CodeOutile`) ON DELETE SET NULL;
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `Etablissement`
                    ADD CONSTRAINT `FK_Etablissement_Categories_CodeCategories`
                    FOREIGN KEY (`CodeCategories`) REFERENCES `Categories` (`CodeCategories`) ON DELETE RESTRICT;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_ProduitUtilise_CodeProduit`;");
            migrationBuilder.Sql("ALTER TABLE `Mission` DROP FOREIGN KEY `FK_Mission_OutilUtilise_CodeOutil`;");
            migrationBuilder.Sql("ALTER TABLE `Etablissement` DROP FOREIGN KEY `FK_Etablissement_Categories_CodeCategories`;");

            migrationBuilder.Sql(@"
                ALTER TABLE `ProduitUtilise` DROP PRIMARY KEY, DROP COLUMN `Id`, DROP INDEX `IX_ProduitUtilise_CodeProduit`;
                ALTER TABLE `ProduitUtilise` ADD PRIMARY KEY (`CodeProduit`);
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `OutilUtilise` DROP PRIMARY KEY, DROP COLUMN `Id`, DROP INDEX `IX_OutilUtilise_CodeOutile`;
                ALTER TABLE `OutilUtilise` ADD PRIMARY KEY (`CodeOutile`);
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `Categories` DROP PRIMARY KEY, DROP COLUMN `Id`, DROP INDEX `IX_Categories_CodeCategories`;
                ALTER TABLE `Categories` ADD PRIMARY KEY (`CodeCategories`);
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE `Mission`
                    ADD CONSTRAINT `FK_Mission_ProduitUtilise_CodeProduit`
                    FOREIGN KEY (`CodeProduit`) REFERENCES `ProduitUtilise` (`CodeProduit`) ON DELETE SET NULL;
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `Mission`
                    ADD CONSTRAINT `FK_Mission_OutilUtilise_CodeOutil`
                    FOREIGN KEY (`CodeOutil`) REFERENCES `OutilUtilise` (`CodeOutile`) ON DELETE SET NULL;
            ");
            migrationBuilder.Sql(@"
                ALTER TABLE `Etablissement`
                    ADD CONSTRAINT `FK_Etablissement_Categories_CodeCategories`
                    FOREIGN KEY (`CodeCategories`) REFERENCES `Categories` (`CodeCategories`) ON DELETE RESTRICT;
            ");
        }
    }
}
