using GamerStats.API.Data;
using GamerStats.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GamerStats.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // Только админ может просматривать всех пользователей
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        var users = await _context.Users
            .OrderBy(u => u.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        var result = users.Select(u => new {
            u.Id,
            u.Username,
            u.Email,
            u.Role
        });

        return Ok(result);
    }


    // Авторизованный пользователь может получить себя по id
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetUser(int id)
    {
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        if (currentUserId != id && !User.IsInRole("Admin"))
            return Forbid();

        var user = await _context.Users
            .Include(u => u.GameStats)
            .ThenInclude(gs => gs.Game)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var result = new
        {
            user.Id,
            user.Username,
            user.Email,
            GameStats = user.GameStats.Select(gs => new {
                gs.GameId,
                GameTitle = gs.Game.Title,
                gs.Status
            })
        };

        return Ok(result);
    }

}
