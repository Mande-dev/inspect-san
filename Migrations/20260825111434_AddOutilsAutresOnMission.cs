using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class AddOutilsAutresOnMission : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OutilsAutres",
                table: "Mission",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "OutilsAutresQuantite",
                table: "Mission",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OutilsAutres",
                table: "Mission");

            migrationBuilder.DropColumn(
                name: "OutilsAutresQuantite",
                table: "Mission");
        }
    }
}
