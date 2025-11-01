import z from 'zod';

// Learning Session Schemas
export const startLearningSessionResponseSchema = z.object({
  message: z.string(),
  session_id: z.number(),
  start_time: z.string(),
});

export const endLearningSessionResponseSchema = z.object({
  message: z.string(),
  session_id: z.number(),
  duration_minutes: z.number(),
});

// Learning Stats Schemas
export const learningStatsResponseSchema = z.object({
  user_id: z.number(),
  total_sessions: z.number(),
  total_minutes: z.number(),
  average_session_minutes: z.number(),
  total_days_active: z.number(),
  first_session_date: z.string().nullable(),
  last_session_date: z.string().nullable(),
});

export const sessionDetailSchema = z.object({
  session_id: z.number(),
  start_time: z.string(),
  end_time: z.string().nullable(),
  duration_minutes: z.number(),
});

export const dailyLearningStatsSchema = z.object({
  user_id: z.number(),
  date: z.string(),
  total_sessions: z.number(),
  total_minutes: z.number(),
  sessions: z.array(sessionDetailSchema),
});

export const dailyBreakdownSchema = z.object({
  date: z.string(),
  sessions: z.number(),
  minutes: z.number(),
});

export const weeklyBreakdownSchema = z.object({
  week: z.number(),
  sessions: z.number(),
  minutes: z.number(),
});

export const monthlyBreakdownSchema = z.object({
  month: z.number(),
  sessions: z.number(),
  minutes: z.number(),
});

export const weeklyLearningStatsSchema = z.object({
  user_id: z.number(),
  year: z.number(),
  week: z.number(),
  week_start: z.string(),
  week_end: z.string(),
  total_sessions: z.number(),
  total_minutes: z.number(),
  days_active: z.number(),
  daily_breakdown: z.array(dailyBreakdownSchema),
});

export const monthlyLearningStatsSchema = z.object({
  user_id: z.number(),
  year: z.number(),
  month: z.number(),
  month_start: z.string(),
  month_end: z.string(),
  total_sessions: z.number(),
  total_minutes: z.number(),
  days_active: z.number(),
  daily_breakdown: z.array(dailyBreakdownSchema),
  weekly_breakdown: z.array(weeklyBreakdownSchema),
});

export const yearlyLearningStatsSchema = z.object({
  user_id: z.number(),
  year: z.number(),
  year_start: z.string(),
  year_end: z.string(),
  total_sessions: z.number(),
  total_minutes: z.number(),
  days_active: z.number(),
  monthly_breakdown: z.array(monthlyBreakdownSchema),
});

// Streak Schemas
export const streakStatsResponseSchema = z.object({
  user_id: z.number(),
  current_streak: z.number(),
  longest_streak: z.number(),
  today_logins: z.number(),
  last_login_date: z.string().nullable(),
});

export const streakHistoryDaySchema = z.object({
  date: z.string(),
  logged_in: z.boolean(),
  current_streak: z.number(),
});

export const streakHistorySummarySchema = z.object({
  total_login_days: z.number(),
  current_streak: z.number(),
  longest_streak: z.number(),
});

export const streakHistoryResponseSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  days: z.number(),
  streak_history: z.array(streakHistoryDaySchema),
  summary: streakHistorySummarySchema,
});

export const leaderboardEntrySchema = z.object({
  user_id: z.number(),
  username: z.string(),
  current_streak: z.number(),
  longest_streak: z.number(),
  rank: z.number(),
});

export const streakLeaderboardResponseSchema = z.object({
  leaderboard: z.array(leaderboardEntrySchema),
  limit: z.number(),
});

// Online Status Schemas
export const userOnlineStatusResponseSchema = z.object({
  user_id: z.number(),
  date: z.string(),
  is_online: z.boolean(),
  checked_at: z.string(),
});

export const currentUserOnlineStatusResponseSchema = z.object({
  user_id: z.number(),
  username: z.string(),
  date: z.string(),
  is_online: z.boolean(),
  checked_at: z.string(),
});

// Types
export type StartLearningSessionResponse = z.infer<typeof startLearningSessionResponseSchema>;
export type EndLearningSessionResponse = z.infer<typeof endLearningSessionResponseSchema>;
export type LearningStatsResponse = z.infer<typeof learningStatsResponseSchema>;
export type SessionDetail = z.infer<typeof sessionDetailSchema>;
export type DailyLearningStats = z.infer<typeof dailyLearningStatsSchema>;
export type DailyBreakdown = z.infer<typeof dailyBreakdownSchema>;
export type WeeklyBreakdown = z.infer<typeof weeklyBreakdownSchema>;
export type MonthlyBreakdown = z.infer<typeof monthlyBreakdownSchema>;
export type WeeklyLearningStats = z.infer<typeof weeklyLearningStatsSchema>;
export type MonthlyLearningStats = z.infer<typeof monthlyLearningStatsSchema>;
export type YearlyLearningStats = z.infer<typeof yearlyLearningStatsSchema>;
export type StreakStatsResponse = z.infer<typeof streakStatsResponseSchema>;
export type StreakHistoryDay = z.infer<typeof streakHistoryDaySchema>;
export type StreakHistorySummary = z.infer<typeof streakHistorySummarySchema>;
export type StreakHistoryResponse = z.infer<typeof streakHistoryResponseSchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type StreakLeaderboardResponse = z.infer<typeof streakLeaderboardResponseSchema>;
export type UserOnlineStatusResponse = z.infer<typeof userOnlineStatusResponseSchema>;
export type CurrentUserOnlineStatusResponse = z.infer<typeof currentUserOnlineStatusResponseSchema>;
