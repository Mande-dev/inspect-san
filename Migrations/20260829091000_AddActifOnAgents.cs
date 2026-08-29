using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using inspect_san.Models.Data;

#nullable disable

namespace inspect_san.Migrations
{
    [DbContext(typeof(InspectSanDbContext))]
    [Migration("20260829091000_AddActifOnAgents")]
    public partial class AddActifOnAgents : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Actif",
                table: "Agents",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateIndex(
                name: "IX_Agents_Actif",
                table: "Agents",
                column: "Actif");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Agents_Actif",
                table: "Agents");

            migrationBuilder.DropColumn(
                name: "Actif",
                table: "Agents");
        }
    }
}
