namespace GamerStats.API.Models;

public class Game
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;

    public ICollection<GameStats> GameStats { get; set; } = new List<GameStats>();
}
