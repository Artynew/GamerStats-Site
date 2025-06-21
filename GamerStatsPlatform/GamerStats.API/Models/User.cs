using GamerStats.API.Models;
using System.Text.Json.Serialization;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string PasswordHash { get; set; } = string.Empty;

    
    public string Role { get; set; } = "User";


    public ICollection<GameStats> GameStats { get; set; } = new List<GameStats>();
}
