import z, { boolean } from 'zod';

import { CEFRLevelSchema, ReadingGenreSchema, genderSchema } from './enum.schema';
import {
  studyInterestsSchema,
  studyRouteAgeSchema,
  studyRouteGoalSchema,
  studyRouteLevelSchema,
  studyRouteProfessionSchema,
  studyRouteRoutineSchema,
  studyRouteSkillSchema,
} from './study-route.schema';

export const lessonTypeSchema = z.enum(['reading', 'writing', 'listening', 'speaking']);

export const lessonStatusSchema = z.enum(['start', 'in_progress', 'done']);

export const dailyPlanStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

export const learningPathStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

// Lesson Parameters Schema
export const lessonParamsSchema = z.object({
  lesson_type: lessonTypeSchema,
  title: z.string(),
  topic: z.string().optional().nullable(),
  level: CEFRLevelSchema.optional(),
  genre: ReadingGenreSchema.optional(),
  word_count: z.number().optional().nullable(),
  total_sentences: z.number().optional().nullable(),
  scenario: z.string().optional().nullable(),
  my_character: z.string().optional().nullable(),
  ai_character: z.string().optional().nullable(),
  ai_gender: genderSchema.optional(),
  lesson_id: z.number().optional().nullable(),
});

// Lesson With Progress Response Schema
export const lessonWithProgressResponseSchema = z.object({
  id: z.number().optional().nullable(),
  lesson_index: z.number(),
  config: lessonParamsSchema,
  title: z.string(),
  status: lessonStatusSchema,
  session_id: z.number().optional().nullable(),
});

// Daily Lesson Plan Response Schema
export const dailyLessonPlanResponseSchema = z.object({
  id: z.number(),
  day_number: z.number(),
  status: dailyPlanStatusSchema,
  lessons: z.array(lessonWithProgressResponseSchema),
});

export const learningPathFormSchema = z.object({
  goals: z.array(studyRouteGoalSchema).min(1),
  level: studyRouteLevelSchema,
  skills: z.array(studyRouteSkillSchema).min(1),
  interests: z.array(studyInterestsSchema).min(1),
  ageRange: studyRouteAgeSchema,
  profession: studyRouteProfessionSchema,
  dailyLessonCount: z.number().int().min(1).max(4),
  planDuration: studyRouteRoutineSchema,
});

// Learning Path Response Schema
export const learningPathResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  form_data: learningPathFormSchema.optional(),
  status: learningPathStatusSchema,
  created_at: z.string().or(z.date()),
  warning: z.string().optional().nullable(),
  daily_plans: z.array(dailyLessonPlanResponseSchema).optional().nullable(),
});

// Learning Path Status Response
export const learningPathStatusResponseSchema = z.object({
  id: z.number(),
  percent: z.number().optional(),
  message: z.string().optional(),
  is_ready: z.boolean().optional(),
  created_at: z.string().or(z.date()),
});

// User Lesson Progress Response Schema
export const userLessonProgressResponseSchema = z.object({
  id: z.number(),
  daily_lesson_plan_id: z.number(),
  lesson_index: z.number(),
  session_id: z.number().optional().nullable(),
  status: lessonStatusSchema,
  metadata_: z.record(z.any(), z.any()),
  created_at: z.string().or(z.date()),
});

// Lesson Start Request
export const lessonStartRequestSchema = z.object({
  session_id: z.number().optional().nullable(),
});

// Delete Response
export const deleteResponseSchema = z.object({
  message: z.string(),
});

// Types
export type LessonType = z.infer<typeof lessonTypeSchema>;
export type LessonStatus = z.infer<typeof lessonStatusSchema>;
export type DailyPlanStatus = z.infer<typeof dailyPlanStatusSchema>;
export type LearningPathStatus = z.infer<typeof learningPathStatusSchema>;

export type LessonParamsSchema = z.infer<typeof lessonParamsSchema>;
export type LessonWithProgressResponseSchema = z.infer<typeof lessonWithProgressResponseSchema>;
export type DailyLessonPlanResponseSchema = z.infer<typeof dailyLessonPlanResponseSchema>;

export type LearningPathFormSchema = z.infer<typeof learningPathFormSchema>;
export type LearningPathResponseSchema = z.infer<typeof learningPathResponseSchema>;
export type LearningPathStatusResponseSchema = z.infer<typeof learningPathStatusResponseSchema>;

export type UserLessonProgressResponseSchema = z.infer<typeof userLessonProgressResponseSchema>;
export type LessonStartRequestSchema = z.infer<typeof lessonStartRequestSchema>;
export type DeleteResponseSchema = z.infer<typeof deleteResponseSchema>;
