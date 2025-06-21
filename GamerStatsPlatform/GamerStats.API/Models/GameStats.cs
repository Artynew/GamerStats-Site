using GamerStats.API.Models;

public class GameStats
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }

    public int GameId { get; set; }
    public Game Game { get; set; }

    public string Status { get; set; } = "not_started";
    public string? Comment { get; set; }
    public int? Rating { get; set; }  // от 1 до 10
}