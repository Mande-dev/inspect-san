using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using inspect_san.Models.Data;

#nullable disable

namespace inspect_san.Migrations;

[DbContext(typeof(InspectSanDbContext))]
[Migration("20260916013000_MissionOmEnvoyeColumns")]
public partial class MissionOmEnvoyeColumns : Migration
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
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Mission' AND COLUMN_NAME = 'OmEnvoyeLe'
                ),
                'SELECT 1',
                'ALTER TABLE `Mission` ADD COLUMN `OmEnvoyeLe` datetime(6) NULL'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Mission' AND COLUMN_NAME = 'OmEnvoyeA'
                ),
                'SELECT 1',
                'ALTER TABLE `Mission` ADD COLUMN `OmEnvoyeA` varchar(200) NULL'
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
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Mission' AND COLUMN_NAME = 'OmEnvoyeA'
                ),
                'ALTER TABLE `Mission` DROP COLUMN `OmEnvoyeA`',
                'SELECT 1'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

            SET @sql := (
              SELECT IF(
                EXISTS(
                  SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'Mission' AND COLUMN_NAME = 'OmEnvoyeLe'
                ),
                'ALTER TABLE `Mission` DROP COLUMN `OmEnvoyeLe`',
                'SELECT 1'
              )
            );
            PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
        ");
    }
}
