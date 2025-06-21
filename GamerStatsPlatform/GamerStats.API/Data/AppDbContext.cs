using Microsoft.EntityFrameworkCore;
using GamerStats.API.Models;
using System.Collections.Generic;


namespace GamerStats.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Game> Games => Set<Game>();
    public DbSet<GameStats> GameStats => Set<GameStats>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<GameStats>()
            .HasOne(gs => gs.User)
            .WithMany(u => u.GameStats)
            .HasForeignKey(gs => gs.UserId);

        modelBuilder.Entity<GameStats>()
            .HasOne(gs => gs.Game)
            .WithMany(g => g.GameStats)
            .HasForeignKey(gs => gs.GameId);
    }
}
