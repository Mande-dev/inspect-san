using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace inspect_san.Migrations
{
    /// <inheritdoc />
    public partial class MissionProduitOutilJunction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MissionOutil",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NumOrdre = table.Column<string>(type: "varchar(80)", maxLength: 80, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CodeOutil = table.Column<int>(type: "int", nullable: false),
                    Quantite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionOutil", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MissionOutil_Mission_NumOrdre",
                        column: x => x.NumOrdre,
                        principalTable: "Mission",
                        principalColumn: "NumOrdre",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MissionOutil_OutilUtilise_CodeOutil",
                        column: x => x.CodeOutil,
                        principalTable: "OutilUtilise",
                        principalColumn: "CodeOutile",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "MissionProduit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    NumOrdre = table.Column<string>(type: "varchar(80)", maxLength: 80, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CodeProduit = table.Column<int>(type: "int", nullable: false),
                    Quantite = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MissionProduit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MissionProduit_Mission_NumOrdre",
                        column: x => x.NumOrdre,
                        principalTable: "Mission",
                        principalColumn: "NumOrdre",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MissionProduit_ProduitUtilise_CodeProduit",
                        column: x => x.CodeProduit,
                        principalTable: "ProduitUtilise",
                        principalColumn: "CodeProduit",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_MissionOutil_CodeOutil",
                table: "MissionOutil",
                column: "CodeOutil");

            migrationBuilder.CreateIndex(
                name: "IX_MissionOutil_NumOrdre_CodeOutil",
                table: "MissionOutil",
                columns: new[] { "NumOrdre", "CodeOutil" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MissionProduit_CodeProduit",
                table: "MissionProduit",
                column: "CodeProduit");

            migrationBuilder.CreateIndex(
                name: "IX_MissionProduit_NumOrdre_CodeProduit",
                table: "MissionProduit",
                columns: new[] { "NumOrdre", "CodeProduit" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MissionOutil");

            migrationBuilder.DropTable(
                name: "MissionProduit");
        }
    }
}
