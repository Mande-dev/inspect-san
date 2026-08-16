using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class AddChefEquipeAndUserControleurId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChefControleurId",
                table: "Equipes",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ControleurId",
                table: "AspNetUsers",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Equipes_ChefControleurId",
                table: "Equipes",
                column: "ChefControleurId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ControleurId",
                table: "AspNetUsers",
                column: "ControleurId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Equipes_Controleurs_ChefControleurId",
                table: "Equipes",
                column: "ChefControleurId",
                principalTable: "Controleurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipes_Controleurs_ChefControleurId",
                table: "Equipes");

            migrationBuilder.DropIndex(
                name: "IX_Equipes_ChefControleurId",
                table: "Equipes");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ControleurId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ChefControleurId",
                table: "Equipes");

            migrationBuilder.DropColumn(
                name: "ControleurId",
                table: "AspNetUsers");
        }
    }
}
