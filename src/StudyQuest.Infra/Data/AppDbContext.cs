using Microsoft.EntityFrameworkCore;
using StudyQuest.Core.Entities;

namespace StudyQuest.Infra.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Module> Modules => Set<Module>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Alternative> Alternatives => Set<Alternative>();
    public DbSet<UserProgress> UserProgresses => Set<UserProgress>();
    public DbSet<Exercise> Exercises => Set<Exercise>();
    public DbSet<MockExam> MockExams => Set<MockExam>();
    public DbSet<MockExamResult> MockExamResults => Set<MockExamResult>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();
    public DbSet<DailyMission> DailyMissions => Set<DailyMission>();
    public DbSet<UserMission> UserMissions => Set<UserMission>();
    public DbSet<ShopItem> ShopItems => Set<ShopItem>();
    public DbSet<UserPurchase> UserPurchases => Set<UserPurchase>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasMaxLength(20).IsRequired();
        });

        // Subject → Modules
        modelBuilder.Entity<Module>(e =>
        {
            e.HasOne(m => m.Subject).WithMany(s => s.Modules).HasForeignKey(m => m.SubjectId);
        });

        // Module → Lessons
        modelBuilder.Entity<Lesson>(e =>
        {
            e.HasOne(l => l.Module).WithMany(m => m.Lessons).HasForeignKey(l => l.ModuleId);
        });

        // Lesson → Questions
        modelBuilder.Entity<Question>(e =>
        {
            e.HasOne(q => q.Lesson).WithMany(l => l.Questions).HasForeignKey(q => q.LessonId).OnDelete(DeleteBehavior.Cascade);
        });

        // Question → Alternatives
        modelBuilder.Entity<Alternative>(e =>
        {
            e.HasOne(a => a.Question).WithMany(q => q.Alternatives).HasForeignKey(a => a.QuestionId).OnDelete(DeleteBehavior.Cascade);
        });

        // UserProgress
        modelBuilder.Entity<UserProgress>(e =>
        {
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId);
            e.HasOne(p => p.Lesson).WithMany().HasForeignKey(p => p.LessonId).OnDelete(DeleteBehavior.SetNull);
        });

        // Exercise
        modelBuilder.Entity<Exercise>(e =>
        {
            e.HasOne(ex => ex.User).WithMany().HasForeignKey(ex => ex.UserId);
            e.HasOne(ex => ex.Question).WithMany().HasForeignKey(ex => ex.QuestionId);
        });

        // MockExamResult
        modelBuilder.Entity<MockExamResult>(e =>
        {
            e.HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId);
            e.HasOne(r => r.MockExam).WithMany().HasForeignKey(r => r.MockExamId);
        });

        // Achievement
        modelBuilder.Entity<UserAchievement>(e =>
        {
            e.HasOne(ua => ua.User).WithMany().HasForeignKey(ua => ua.UserId);
            e.HasOne(ua => ua.Achievement).WithMany().HasForeignKey(ua => ua.AchievementId);
        });

        // Missions
        modelBuilder.Entity<UserMission>(e =>
        {
            e.HasOne(um => um.User).WithMany().HasForeignKey(um => um.UserId);
            e.HasOne(um => um.Mission).WithMany().HasForeignKey(um => um.MissionId);
        });

        // Purchases
        modelBuilder.Entity<UserPurchase>(e =>
        {
            e.HasOne(p => p.User).WithMany().HasForeignKey(p => p.UserId);
            e.HasOne(p => p.ShopItem).WithMany().HasForeignKey(p => p.ShopItemId);
        });
    }
}
