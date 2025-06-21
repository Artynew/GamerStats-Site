using GamerStats.API.Data;
using GamerStats.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamerStats.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly AppDbContext _context;

    public GamesController(AppDbContext context)
    {
        _context = context;
    }

 
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetAllGames([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        if (page < 1 || limit < 1) return BadRequest("Неверные параметры страницы.");

        var games = await _context.Games
            .Include(g => g.GameStats)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var result = games.Select(g => new
        {
            g.Id,
            g.Title,
            g.Genre,
            AverageRating = g.GameStats.Any(gs => gs.Rating.HasValue)
                ? (double?)Math.Round(g.GameStats.Where(gs => gs.Rating.HasValue).Average(gs => gs.Rating.Value), 1)
                : null
        });

        return Ok(result);
    }

    [HttpPost]
    [Authorize] 
    public async Task<IActionResult> CreateGame(Game newGame)
    {
        if (string.IsNullOrWhiteSpace(newGame.Title) || string.IsNullOrWhiteSpace(newGame.Genre))
            return BadRequest("Название и жанр обязательны.");

        _context.Games.Add(newGame);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGame), new { id = newGame.Id }, newGame);
    }


    [HttpGet("{id}")]
    public async Task<ActionResult<object>> GetGame(int id)
    {
        var game = await _context.Games
            .Include(g => g.GameStats)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (game == null) return NotFound();

        var result = new
        {
            game.Id,
            game.Title,
            game.Genre,
            AverageRating = game.GameStats.Any(gs => gs.Rating.HasValue)
                ? (double?)Math.Round(game.GameStats.Where(gs => gs.Rating.HasValue).Average(gs => gs.Rating.Value), 1)
                : null
        };

        return Ok(result);
    }



    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateGame(int id, Game updatedGame)
    {
        if (id != updatedGame.Id) return BadRequest();

        var game = await _context.Games.FindAsync(id);
        if (game == null) return NotFound();

        game.Title = updatedGame.Title;
        game.Genre = updatedGame.Genre;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null) return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchGames([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Введите текст для поиска.");

        query = query.ToLower();

        var games = await _context.Games
            .Include(g => g.GameStats)
            .Where(g => g.Title.ToLower().Contains(query) || g.Genre.ToLower().Contains(query))
            .Select(g => new
            {
                g.Id,
                g.Title,
                g.Genre,
                AverageRating = g.GameStats.Any(gs => gs.Rating.HasValue)
                    ? Math.Round(g.GameStats.Where(gs => gs.Rating.HasValue).Average(gs => gs.Rating.Value), 1)
                    : (double?)null
            })
            .ToListAsync();

        return Ok(games);
    }




}
