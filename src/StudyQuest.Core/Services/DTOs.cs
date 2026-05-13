namespace StudyQuest.Core.Services;

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, string Name, string Role, DateTime ExpiresAt);
public record RegisterRequest(string Name, string Email, string Password);

public record UserProfileResponse(
    Guid Id, string Name, string Email, string? AvatarUrl,
    int Level, int Xp, int TotalXp, int Coins, int Vigor, int MaxVigor,
    int Streak, string Role
);

public record SubjectResponse(Guid Id, string Name, string? Icon, string? Color, int Order, int ModuleCount);
public record ModuleResponse(Guid Id, string Name, string? Description, int Order, int LessonCount);
public record LessonResponse(Guid Id, string Title, string? Content, string? VideoUrl, int Order, int XpReward);
public record QuestionResponse(Guid Id, string Text, string? Explanation, int Difficulty, int XpReward, List<AlternativeResponse> Alternatives);
public record AlternativeResponse(Guid Id, string Text, bool IsCorrect);

public record SubmitAnswerRequest(Guid QuestionId, Guid? SelectedAlternativeId);
public record SubmitAnswerResponse(bool Correct, int XpEarned, string? Explanation, int CurrentXp, int CurrentLevel);

public record MockExamResponse(Guid Id, string Title, string? Description, int DurationMinutes, int QuestionCount);
public record MockExamResultResponse(Guid Id, string Title, int Score, int CorrectAnswers, int TotalQuestions, DateTime Date);

public record ProgressResponse(Guid? LessonId, bool Completed, int Score);
public record ProfileProgressResponse(int CompletedLessons, int TotalXp, int Streak, List<SubjectProgressResponse> Subjects);
public record SubjectProgressResponse(Guid SubjectId, string SubjectName, int CompletedLessons, int TotalLessons, double Percentage);

public record AchievementResponse(Guid Id, string Name, string? Description, string? Icon, bool Unlocked, DateTime? UnlockedAt);
public record DailyMissionResponse(Guid Id, string Title, string? Description, int XpReward, int CoinsReward, int Progress, int Target, bool Completed, bool Claimed);
public record ShopItemResponse(Guid Id, string Name, string? Description, int Price, string? Icon, string Type);

public record GamificationInfo(int Level, int Xp, int TotalXp, int XpToNextLevel, int Coins, int Vigor, int MaxVigor, int Streak);
