using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using inspect_san.Models.Data;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(InspectSanDbContext))]
    [Migration("20260826013400_AddEcritureDelegueeOnAffectation")]
    public partial class AddEcritureDelegueeOnAffectation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EcritureDeleguee",
                table: "Affectation",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EcritureDeleguee",
                table: "Affectation");
        }
    }
}
