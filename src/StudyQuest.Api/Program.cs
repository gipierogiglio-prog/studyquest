using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using StudyQuest.Infra.Data;
using StudyQuest.Core.Entities;
using StudyQuest.Core.Services;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = "StudyQuest-Secret-Key-2024!@#$%StudyQuest";

// Services
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseInMemoryDatabase("StudyQuest"));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true, ValidateIssuerSigningKey = true,
        ValidIssuer = "StudyQuest", ValidAudience = "StudyQuest-App",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    });
builder.Services.AddAuthorization();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (!db.Subjects.Any())
    {
        var subjects = new[] {
            new Subject { Name = "Português", Icon = "book", Color = "#4CAF50", Order = 1 },
            new Subject { Name = "Matemática", Icon = "calculator", Color = "#2196F3", Order = 2 },
            new Subject { Name = "Física", Icon = "atom", Color = "#FF9800", Order = 3 },
            new Subject { Name = "Química", Icon = "flask", Color = "#9C27B0", Order = 4 },
            new Subject { Name = "Biologia", Icon = "dna", Color = "#4CAF50", Order = 5 },
            new Subject { Name = "História", Icon = "landmark", Color = "#795548", Order = 6 },
            new Subject { Name = "Geografia", Icon = "globe", Color = "#607D8B", Order = 7 },
            new Subject { Name = "Filosofia", Icon = "brain", Color = "#3F51B5", Order = 8 },
            new Subject { Name = "Sociologia", Icon = "users", Color = "#E91E63", Order = 9 },
            new Subject { Name = "Inglês", Icon = "globe", Color = "#00BCD4", Order = 10 },
            new Subject { Name = "Redação", Icon = "edit", Color = "#FF5722", Order = 11 },
        };
        db.Subjects.AddRange(subjects);
        db.SaveChanges();

        // Demo user
        var user = new User
        {
            Name = "Aluno Demo", Email = "demo@studyquest.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
            Level = 5, TotalXp = 2450, Coins = 120, Vigor = 80,
        };
        db.Users.Add(user);

        // Achievements
        var achievements = new[] {
            new Achievement { Name = "Primeiros Passos", Description = "Complete sua primeira aula", XpReward = 50, Condition = "complete_1_lessons" },
            new Achievement { Name = "Dedicado", Description = "Complete 10 aulas", XpReward = 200, Condition = "complete_10_lessons" },
            new Achievement { Name = "Maratona", Description = "Complete 50 aulas", XpReward = 1000, Condition = "complete_50_lessons" },
            new Achievement { Name = "Semana de Estudos", Description = "Mantenha 7 dias de streak", XpReward = 500, Condition = "streak_7" },
            new Achievement { Name = "Mestre", Description = "Responda 100 questões corretamente", XpReward = 300, Condition = "correct_100" },
            new Achievement { Name = "Simulado Nota 10", Description = "Tire 100% em um simulado", XpReward = 1000, Condition = "mockexam_perfect" },
        };
        db.Achievements.AddRange(achievements);

        // Shop items
        var shopItems = new[] {
            new ShopItem { Name = "Recarga de Vigor", Description = "Recupera 50 de vigor instantaneamente", Price = 50, Icon = "zap", Type = "vigor" },
            new ShopItem { Name = "Bônus de XP", Description = "Dobre o XP ganho por 1 hora", Price = 100, Icon = "star", Type = "bonus_xp" },
            new ShopItem { Name = "Tema Noturno", Description = "Tema escuro exclusivo", Price = 200, Icon = "moon", Type = "theme" },
            new ShopItem { Name = "Avatar Ninja", Description = "Avatar exclusivo de Ninja", Price = 300, Icon = "user", Type = "avatar" },
        };
        db.ShopItems.AddRange(shopItems);
        db.SaveChanges();
    }
}

// === Helper Functions ===
string GenerateToken(User user)
{
    var claims = new[] {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
    };
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
    var token = new JwtSecurityToken("StudyQuest", "StudyQuest-App", claims,
        expires: DateTime.UtcNow.AddDays(30), signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
    return new JwtSecurityTokenHandler().WriteToken(token);
}

int XpForLevel(int level) => (int)(100 * Math.Pow(1.5, level - 1));
int CalculateLevel(int totalXp) { int lvl = 1; while (totalXp >= XpForLevel(lvl)) { totalXp -= XpForLevel(lvl); lvl++; } return lvl; }

Guid? GetUserId(ClaimsPrincipal user)
{
    var val = user.FindFirstValue(ClaimTypes.NameIdentifier);
    return Guid.TryParse(val, out var id) ? id : null;
}

// === Auth ===
app.MapPost("/api/auth/login", async (LoginRequest req, AppDbContext db) =>
{
    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        return Results.Unauthorized();
    return Results.Ok(new LoginResponse(GenerateToken(user), user.Name, user.Role, DateTime.UtcNow.AddDays(30)));
});

app.MapPost("/api/auth/register", async (RegisterRequest req, AppDbContext db) =>
{
    if (await db.Users.AnyAsync(u => u.Email == req.Email))
        return Results.BadRequest(new { message = "Email já cadastrado" });
    var user = new User { Name = req.Name, Email = req.Email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password) };
    db.Users.Add(user); await db.SaveChangesAsync();
    return Results.Ok(new LoginResponse(GenerateToken(user), user.Name, user.Role, DateTime.UtcNow.AddDays(30)));
});

// === Profile ===
app.MapGet("/api/profile", async (AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var id = GetUserId(userClaim); if (id == null) return Results.Unauthorized();
    var user = await db.Users.FindAsync(id.Value); if (user == null) return Results.NotFound();
    var xpForNext = XpForLevel(user.Level);
    return Results.Ok(new GamificationInfo(user.Level, user.Xp, user.TotalXp, xpForNext, user.Coins, user.Vigor, user.MaxVigor, user.Streak));
});

// === Subjects ===
app.MapGet("/api/subjects", async (AppDbContext db) =>
{
    var subjects = await db.Subjects.Include(s => s.Modules).OrderBy(s => s.Order).ToListAsync();
    return Results.Ok(subjects.Select(s => new SubjectResponse(s.Id, s.Name, s.Icon, s.Color, s.Order, s.Modules.Count)));
});

app.MapGet("/api/subjects/{id}/modules", async (Guid id, AppDbContext db) =>
{
    var modules = await db.Modules.Where(m => m.SubjectId == id).Include(m => m.Lessons).OrderBy(m => m.Order).ToListAsync();
    return Results.Ok(modules.Select(m => new ModuleResponse(m.Id, m.Name, m.Description, m.Order, m.Lessons.Count)));
});

app.MapGet("/api/modules/{id}/lessons", async (Guid id, AppDbContext db) =>
{
    var lessons = await db.Lessons.Where(l => l.ModuleId == id).OrderBy(l => l.Order).ToListAsync();
    return Results.Ok(lessons.Select(l => new LessonResponse(l.Id, l.Title, l.Content, l.VideoUrl, l.Order, l.XpReward)));
});

app.MapGet("/api/lessons/{id}", async (Guid id, AppDbContext db) =>
{
    var lesson = await db.Lessons.Include(l => l.Questions).ThenInclude(q => q.Alternatives).FirstOrDefaultAsync(l => l.Id == id);
    if (lesson == null) return Results.NotFound();
    return Results.Ok(new
    {
        Lesson = new LessonResponse(lesson.Id, lesson.Title, lesson.Content, lesson.VideoUrl, lesson.Order, lesson.XpReward),
        Questions = lesson.Questions.Select(q => new QuestionResponse(q.Id, q.Text, q.Explanation, q.Difficulty, q.XpReward,
            q.Alternatives.Select(a => new AlternativeResponse(a.Id, a.Text, a.IsCorrect)).ToList()))
    });
});

// === Exercises ===
app.MapPost("/api/exercises/submit", async (SubmitAnswerRequest req, AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var question = await db.Questions.Include(q => q.Alternatives).FirstOrDefaultAsync(q => q.Id == req.QuestionId);
    if (question == null) return Results.NotFound();

    var alternative = req.SelectedAlternativeId.HasValue
        ? question.Alternatives.FirstOrDefault(a => a.Id == req.SelectedAlternativeId.Value) : null;

    var correct = alternative?.IsCorrect ?? false;
    var xpEarned = correct ? question.XpReward : 0;

    var user = await db.Users.FindAsync(userId.Value)!;
    if (correct)
    {
        user.Xp += xpEarned;
        user.TotalXp += xpEarned;
        user.Level = CalculateLevel(user.TotalXp);
        user.Coins += 2; // bonus coins for correct answer
    }
    user.Vigor = Math.Max(0, user.Vigor - 1);

    db.Exercises.Add(new Exercise
    {
        UserId = userId.Value, QuestionId = req.QuestionId,
        SelectedAlternativeId = req.SelectedAlternativeId, Correct = correct, XpEarned = xpEarned
    });
    await db.SaveChangesAsync();

    return Results.Ok(new SubmitAnswerResponse(correct, xpEarned, question.Explanation, user.Xp, user.Level));
});

// === Progress ===
app.MapGet("/api/progress", async (AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var progresses = await db.UserProgresses.Where(p => p.UserId == userId.Value).ToListAsync();
    var subjects = await db.Subjects.Include(s => s.Modules).ThenInclude(m => m.Lessons).ToListAsync();
    var subjectProgress = subjects.Select(s =>
    {
        var lessonIds = s.Modules.SelectMany(m => m.Lessons).Select(l => l.Id).ToList();
        var completed = progresses.Count(p => p.Completed && p.LessonId.HasValue && lessonIds.Contains(p.LessonId.Value));
        return new SubjectProgressResponse(s.Id, s.Name, completed, lessonIds.Count,
            lessonIds.Count > 0 ? Math.Round((double)completed / lessonIds.Count * 100, 1) : 0);
    }).ToList();

    var user = await db.Users.FindAsync(userId.Value);
    return Results.Ok(new ProfileProgressResponse(progresses.Count(p => p.Completed), user?.TotalXp ?? 0, user?.Streak ?? 0, subjectProgress));
});

app.MapPost("/api/progress/lesson/{lessonId}/complete", async (Guid lessonId, AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var existing = await db.UserProgresses.FirstOrDefaultAsync(p => p.UserId == userId.Value && p.LessonId == lessonId);
    if (existing != null) return Results.Ok(existing);

    var progress = new UserProgress { UserId = userId.Value, LessonId = lessonId, Completed = true, Score = 100 };
    db.UserProgresses.Add(progress);

    var user = await db.Users.FindAsync(userId.Value);
    var lesson = await db.Lessons.FindAsync(lessonId);
    if (lesson != null) { user.Xp += lesson.XpReward; user.TotalXp += lesson.XpReward; user.Level = CalculateLevel(user.TotalXp); }

    await db.SaveChangesAsync();
    return Results.Ok(progress);
});

// === Mock Exams ===
app.MapGet("/api/mock-exams", async (AppDbContext db) =>
    Results.Ok(await db.MockExams.Where(m => m.Active).Select(m =>
        new MockExamResponse(m.Id, m.Title, m.Description, m.DurationMinutes, m.QuestionCount)).ToListAsync()));

// === Achievements ===
app.MapGet("/api/achievements", async (AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var userAchievements = await db.UserAchievements.Where(ua => ua.UserId == userId).ToListAsync();
    var all = await db.Achievements.ToListAsync();
    return Results.Ok(all.Select(a => new AchievementResponse(a.Id, a.Name, a.Description, a.Icon,
        userAchievements.Any(ua => ua.AchievementId == a.Id),
        userAchievements.FirstOrDefault(ua => ua.AchievementId == a.Id)?.UnlockedAt)));
});

// === Daily Missions ===
app.MapGet("/api/daily-missions", async (AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var today = DateTime.UtcNow.Date;
    var missions = await db.DailyMissions.Where(m => m.Active).ToListAsync();
    var userMissions = await db.UserMissions.Where(um => um.UserId == userId && um.Date == today).ToListAsync();

    // Generate missions if none exist for today
    if (!userMissions.Any())
    {
        foreach (var m in missions)
        {
            db.UserMissions.Add(new UserMission { UserId = userId.Value, MissionId = m.Id, Date = today });
        }
        await db.SaveChangesAsync();
        userMissions = await db.UserMissions.Where(um => um.UserId == userId && um.Date == today).ToListAsync();
    }

    return Results.Ok(missions.Select(m =>
    {
        var um = userMissions.FirstOrDefault(x => x.MissionId == m.Id);
        return new DailyMissionResponse(m.Id, m.Title, m.Description, m.XpReward, m.CoinsReward,
            um?.Progress ?? 0, m.Target, um?.Completed ?? false, um?.Claimed ?? false);
    }));
});

app.MapPost("/api/daily-missions/{id}/claim", async (Guid id, AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var um = await db.UserMissions.Include(um => um.Mission)
        .FirstOrDefaultAsync(x => x.UserId == userId && x.MissionId == id && x.Date == DateTime.UtcNow.Date);
    if (um == null || !um.Completed || um.Claimed) return Results.BadRequest();

    var user = await db.Users.FindAsync(userId);
    user.Xp += um.Mission.XpReward; user.TotalXp += um.Mission.XpReward;
    user.Coins += um.Mission.CoinsReward;
    user.Level = CalculateLevel(user.TotalXp);
    um.Claimed = true;
    await db.SaveChangesAsync();
    return Results.Ok(new { message = "Recompensa resgatada!" });
});

// === Shop ===
app.MapGet("/api/shop/items", async (AppDbContext db) =>
    Results.Ok(await db.ShopItems.Where(s => s.Active).Select(s =>
        new ShopItemResponse(s.Id, s.Name, s.Description, s.Price, s.Icon, s.Type)).ToListAsync()));

app.MapPost("/api/shop/buy/{itemId}", async (Guid itemId, AppDbContext db, ClaimsPrincipal userClaim) =>
{
    var userId = GetUserId(userClaim); if (userId == null) return Results.Unauthorized();
    var item = await db.ShopItems.FindAsync(itemId); if (item == null) return Results.NotFound();
    var user = await db.Users.FindAsync(userId);
    if (user.Coins < item.Price) return Results.BadRequest(new { message = "Moedas insuficientes" });

    user.Coins -= item.Price;
    if (item.Type == "vigor") user.Vigor = Math.Min(user.MaxVigor, user.Vigor + 50);

    db.UserPurchases.Add(new UserPurchase { UserId = userId.Value, ShopItemId = itemId });
    await db.SaveChangesAsync();
    return Results.Ok(new { message = $"{item.Name} adquirido!", coins = user.Coins, vigor = user.Vigor });
});

app.Run("http://0.0.0.0:5000");
