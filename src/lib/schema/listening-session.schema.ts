import z from 'zod';

import { createListResponseSchema } from './pagination';

// Enums
export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const SessionStatusSchema = z.enum(['active', 'completed']);

// Lesson schemas
export const lessonCreateSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(255),
  youtube_url: z.string().url('URL YouTube không hợp lệ'),
});

export const lessonUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  youtube_url: z.string().url().optional(),
  level: CEFRLevelSchema.optional(),
});

export const sentenceResponseSchema = z.object({
  id: z.number(),
  lesson_id: z.number(),
  sentence_index: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  original_text: z.string(),
  vietnamese_translation: z.string(),
  difficulty_level: CEFRLevelSchema,
  created_at: z.string().or(z.date()),
});

export const lessonResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  youtube_url: z.string(),
  level: CEFRLevelSchema,
  total_sentences: z.number(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable().optional(),
});

export const lessonDetailResponseSchema = lessonResponseSchema.extend({
  sentences: z.array(sentenceResponseSchema),
});

// Session schemas
export const sessionCreateSchema = z.object({
  lesson_id: z.number().int().min(1, 'ID bài học không hợp lệ'),
});

export const sessionResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  lesson: lessonResponseSchema,
  lesson_id: z.number(),
  current_sentence_index: z.number(),
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable().optional(),
});

export const sessionDetailResponseSchema = sessionResponseSchema.extend({
  current_sentence: sentenceResponseSchema.nullable().optional(),
});

export const userSessionResponseSchema = z.object({
  id: z.number(),
  lesson_id: z.number(),
  lesson_title: z.string(),
  lesson_level: CEFRLevelSchema,
  current_sentence_index: z.number(),
  total_sentences: z.number(),
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
});

// List response schemas
export const lessonListResponseSchema = createListResponseSchema(lessonResponseSchema);
export const userSessionListResponseSchema = createListResponseSchema(userSessionResponseSchema);

// Types
export type CEFRLevel = z.infer<typeof CEFRLevelSchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

export type LessonCreateSchema = z.infer<typeof lessonCreateSchema>;
export type LessonUpdateSchema = z.infer<typeof lessonUpdateSchema>;
export type SentenceResponseSchema = z.infer<typeof sentenceResponseSchema>;
export type LessonResponseSchema = z.infer<typeof lessonResponseSchema>;
export type LessonDetailResponseSchema = z.infer<typeof lessonDetailResponseSchema>;

export type SessionCreateSchema = z.infer<typeof sessionCreateSchema>;
export type SessionResponseSchema = z.infer<typeof sessionResponseSchema>;
export type SessionDetailResponseSchema = z.infer<typeof sessionDetailResponseSchema>;
export type UserSessionResponseSchema = z.infer<typeof userSessionResponseSchema>;

export type LessonListResponseSchema = z.infer<typeof lessonListResponseSchema>;
export type UserSessionListResponseSchema = z.infer<typeof userSessionListResponseSchema>;
