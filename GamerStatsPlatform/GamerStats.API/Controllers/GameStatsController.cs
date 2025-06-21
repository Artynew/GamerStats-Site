using GamerStats.API.Data;
using GamerStats.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GamerStats.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
public class FeedbackInput
{
    public string? Comment { get; set; }
    public int? Rating { get; set; }

}

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class GameStatsController : ControllerBase

{
    private readonly AppDbContext _context;

    public GameStatsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllStats([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var stats = await _context.GameStats
            .Include(gs => gs.User)
            .Include(gs => gs.Game)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var result = stats.Select(gs => new
        {
            gs.Id,
            UserId = gs.UserId,
            Username = gs.User.Username,
            GameId = gs.GameId,
            GameTitle = gs.Game.Title,
            gs.Status
        });

        return Ok(result);
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetStats(int id)
    {
        var stats = await _context.GameStats
            .Include(gs => gs.Game)
            .Include(gs => gs.User)
            .FirstOrDefaultAsync(gs => gs.Id == id);

        if (stats == null)
            return NotFound();

        var result = new
        {
            stats.Id,
            GameId = stats.GameId,
            GameTitle = stats.Game?.Title,
            UserId = stats.UserId,
            Username = stats.User?.Username,
            stats.Status
        };

        return Ok(result);
    }



    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateStats(GameStatsCreateDto input)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        var stats = new GameStats
        {
            UserId = userId,
            GameId = input.GameId,
            Status = input.Status
        };

        _context.GameStats.Add(stats);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStats), new { id = stats.Id }, stats);

    }



    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStats(int id, GameStats updated)
    {
        if (id != updated.Id) return BadRequest();

        var existing = await _context.GameStats.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Status = updated.Status;
        existing.GameId = updated.GameId;
        existing.UserId = updated.UserId;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteStats(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        var stat = await _context.GameStats.FirstOrDefaultAsync(gs => gs.Id == id);
        if (stat == null) return NotFound();

        // Если не админ и не владелец — отказ
        if (!isAdmin && stat.UserId != userId)
            return Forbid("Вы не можете удалить статистику другого пользователя.");

        _context.GameStats.Remove(stat);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyStats()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        var stats = await _context.GameStats
            .Where(gs => gs.UserId == userId)
            .Include(gs => gs.Game)
            .ToListAsync();

        var result = stats.Select(gs => new
        {
            Id = gs.Id,
            gs.GameId,
            GameTitle = gs.Game.Title,
            gs.Status,
            gs.Comment,
            gs.Rating
        });


        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string newStatus)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
            return Unauthorized();

        int userId = int.Parse(userIdClaim.Value);

        var stat = await _context.GameStats.FirstOrDefaultAsync(gs => gs.Id == id && gs.UserId == userId);
        if (stat == null)
            return NotFound("Статистика не найдена или нет доступа.");

        stat.Status = newStatus;
        await _context.SaveChangesAsync();

        return Ok("Статус обновлён.");
    }




    [HttpPatch("{id}/feedback")]
    [Authorize]
    public async Task<IActionResult> UpdateFeedback(int id, [FromBody] FeedbackInput input)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var stat = await _context.GameStats.FirstOrDefaultAsync(gs => gs.Id == id && gs.UserId == userId);

        if (stat == null)
            return NotFound("Статистика не найдена или нет доступа.");

        if (input.Rating is < 1 or > 10)
            return BadRequest("Рейтинг должен быть от 1 до 10.");

        stat.Comment = input.Comment;
        stat.Rating = input.Rating;

        await _context.SaveChangesAsync();

        return Ok("Комментарий и рейтинг обновлены.");
    }


    // Получить все отзывы к конкретной игре
    [HttpGet("game/{gameId}/feedback")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFeedbackForGame(int gameId)
    {
        var feedbacks = await _context.GameStats
            .Where(gs => gs.GameId == gameId &&
                        (!string.IsNullOrEmpty(gs.Comment) || gs.Rating.HasValue))
            .Include(gs => gs.User)
            .ToListAsync();

        var result = feedbacks.Select(f => new
        {
            f.Id,
            f.UserId,
            Username = f.User.Username,
            f.Comment,
            f.Rating,
            f.Status
        });

        return Ok(result);
    }

    [HttpDelete("{id}/feedback")]
    [Authorize]
    public async Task<IActionResult> DeleteFeedback(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var isAdmin = User.IsInRole("Admin");

        var stat = await _context.GameStats.FirstOrDefaultAsync(gs => gs.Id == id);
        if (stat == null)
            return NotFound("Отзыв не найден.");

        if (!isAdmin && stat.UserId != userId)
            return BadRequest("Вы не можете удалить чужой отзыв.");

        stat.Comment = null;
        stat.Rating = null;

        await _context.SaveChangesAsync();

        return Ok("Отзыв удалён.");
    }




}
