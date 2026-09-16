using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using inspect_san.Models.Data;

#nullable disable

namespace inspect_san.Migrations;

[DbContext(typeof(InspectSanDbContext))]
[Migration("20260916103000_DecisionLdEnvoyeColumns")]
public partial class DecisionLdEnvoyeColumns : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            SET @db := DATABASE();
            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Decision' AND COLUMN_NAME = 'LdEnvoyeLe'
                ),
                'SELECT 1',
                'ALTER TABLE `Decision` ADD COLUMN `LdEnvoyeLe` datetime(6) NULL'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Decision' AND COLUMN_NAME = 'LdEnvoyeA'
                ),
                'SELECT 1',
                'ALTER TABLE `Decision` ADD COLUMN `LdEnvoyeA` varchar(200) NULL'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
        ");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.Sql(@"
            SET @db := DATABASE();
            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Decision' AND COLUMN_NAME = 'LdEnvoyeA'
                ),
                'ALTER TABLE `Decision` DROP COLUMN `LdEnvoyeA`',
                'SELECT 1'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Decision' AND COLUMN_NAME = 'LdEnvoyeLe'
                ),
                'ALTER TABLE `Decision` DROP COLUMN `LdEnvoyeLe`',
                'SELECT 1'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
        ");
    }
}
