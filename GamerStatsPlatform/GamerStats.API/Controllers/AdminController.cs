using GamerStats.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GamerStats.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        if (id == currentUserId)
            return BadRequest("Администратор не может удалить сам себя.");

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("Пользователь удалён");
    }

    [HttpDelete("games/{id}")]
    public async Task<IActionResult> DeleteGame(int id)
    {
        var game = await _context.Games.FindAsync(id);
        if (game == null) return NotFound();

        _context.Games.Remove(game);
        await _context.SaveChangesAsync();

        return Ok("Игра удалена");
    }

    [HttpDelete("gamestats/{id}")]
    public async Task<IActionResult> DeleteGameStats(int id)
    {
        var stats = await _context.GameStats.FindAsync(id);
        if (stats == null) return NotFound();

        _context.GameStats.Remove(stats);
        await _context.SaveChangesAsync();

        return Ok("Статистика удалена");
    }
}
