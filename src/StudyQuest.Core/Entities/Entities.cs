namespace StudyQuest.Core.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "student"; // admin, teacher, student
    public bool Active { get; set; } = true;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }

    // Gamification
    public int Level { get; set; } = 1;
    public int Xp { get; set; }
    public int TotalXp { get; set; }
    public int Coins { get; set; }
    public int Vigor { get; set; } = 100;
    public int MaxVigor { get; set; } = 100;
    public int Streak { get; set; }
    public DateTime? LastVigorRecharge { get; set; }
    public DateTime? LastActivityDate { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public class Subject
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public string? Color { get; set; }
    public int Order { get; set; }
    public bool Active { get; set; } = true;
    public ICollection<Module> Modules { get; set; } = new List<Module>();
}

public class Module
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Order { get; set; }
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
}

public class Lesson
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }
    public int Order { get; set; }
    public int XpReward { get; set; } = 50;
    public Guid ModuleId { get; set; }
    public Module Module { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}

public class Question
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Text { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public int Difficulty { get; set; } = 1; // 1-5
    public int XpReward { get; set; } = 10;
    public Guid? LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    public ICollection<Alternative> Alternatives { get; set; } = new List<Alternative>();
}

public class Alternative
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}

public class UserProgress
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid? LessonId { get; set; }
    public Lesson? Lesson { get; set; }
    public bool Completed { get; set; }
    public int Score { get; set; }
    public int Attempts { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Exercise
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
    public Guid? SelectedAlternativeId { get; set; }
    public bool Correct { get; set; }
    public int XpEarned { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
}

public class MockExam
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DurationMinutes { get; set; } = 180;
    public int QuestionCount { get; set; }
    public Guid? SubjectId { get; set; }
    public Subject? Subject { get; set; }
    public bool Active { get; set; } = true;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}

public class MockExamResult
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid MockExamId { get; set; }
    public MockExam MockExam { get; set; } = null!;
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Achievement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public int XpReward { get; set; }
    public string Condition { get; set; } = string.Empty; // ex: "complete_10_lessons"
}

public class UserAchievement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid AchievementId { get; set; }
    public Achievement Achievement { get; set; } = null!;
    public DateTime UnlockedAt { get; set; } = DateTime.UtcNow;
}

public class DailyMission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int XpReward { get; set; } = 100;
    public int CoinsReward { get; set; } = 10;
    public string Type { get; set; } = string.Empty; // "exercises", "lessons", "streak"
    public int Target { get; set; } = 5;
    public bool Active { get; set; } = true;
}

public class UserMission
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid MissionId { get; set; }
    public DailyMission Mission { get; set; } = null!;
    public int Progress { get; set; }
    public bool Completed { get; set; }
    public bool Claimed { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
}

public class ShopItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Price { get; set; }
    public string? Icon { get; set; }
    public string Type { get; set; } = string.Empty; // "theme", "avatar", "bonus_xp", "vigor"
    public bool Active { get; set; } = true;
}

public class UserPurchase
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid ShopItemId { get; set; }
    public ShopItem ShopItem { get; set; } = null!;
    public DateTime Date { get; set; } = DateTime.UtcNow;
}
