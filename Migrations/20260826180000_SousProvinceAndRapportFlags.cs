using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using inspect_san.Models.Data;

#nullable disable

namespace inspect_san.Migrations
{
    [DbContext(typeof(InspectSanDbContext))]
    [Migration("20260826180000_SousProvinceAndRapportFlags")]
    public partial class SousProvinceAndRapportFlags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SousProvince",
                columns: table => new
                {
                    Code = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false),
                    Libelle = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SousProvince", x => x.Code);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SousProvince_Libelle",
                table: "SousProvince",
                column: "Libelle",
                unique: true);

            migrationBuilder.Sql("""
                INSERT INTO `SousProvince` (`Code`, `Libelle`) VALUES
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

            migrationBuilder.AddColumn<DateTime>(
                name: "RapportEquipeDeposeLe",
                table: "Mission",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RapportEquipeDeposePar",
                table: "Mission",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RapportSecretariatDeposeLe",
                table: "Mission",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RapportSecretariatDeposePar",
                table: "Mission",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RapportClos",
                table: "Mission",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "RapportClosLe",
                table: "Mission",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RapportClosPar",
                table: "Mission",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "RapportEquipeDeposeLe", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportEquipeDeposePar", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportSecretariatDeposeLe", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportSecretariatDeposePar", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportClos", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportClosLe", table: "Mission");
            migrationBuilder.DropColumn(name: "RapportClosPar", table: "Mission");
            migrationBuilder.DropTable(name: "SousProvince");
        }
    }
}
