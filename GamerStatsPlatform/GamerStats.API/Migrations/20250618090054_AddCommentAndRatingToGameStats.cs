using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GamerStats.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCommentAndRatingToGameStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "GameStats",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "GameStats",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "GameStats");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "GameStats");
        }
    }
}
