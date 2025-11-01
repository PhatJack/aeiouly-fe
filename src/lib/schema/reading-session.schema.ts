import z from 'zod';

import { createListResponseSchema } from './pagination';

// Enums
export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

export const ReadingGenreSchema = z.enum([
  'Bài báo',
  'Email/Thư từ',
  'Truyện ngắn',
  'Hội thoại',
  'Bài luận',
  'Đánh giá sản phẩm',
  'Bài mạng xã hội',
  'Hướng dẫn sử dụng',
]);

// Create schemas
export const readingSessionCreateSchema = z.object({
  // AI generation fields
  level: CEFRLevelSchema.optional(),
  genre: ReadingGenreSchema.optional(),
  word_count: z.number().int().min(100).max(1000).optional(),
  topic: z.string().max(200).optional(),

  // Custom text field
  custom_text: z.string().optional(),
});

export const summarySubmissionSchema = z.object({
  summary: z.string().min(50).max(2000),
});

export const quizGenerationRequestSchema = z.object({
  number_of_questions: z.number().int().min(3).max(10).default(5),
});

// Response schemas
export const readingSessionResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  word_count: z.number(),
  level: CEFRLevelSchema,
  genre: ReadingGenreSchema,
  topic: z.string(),
  is_custom: z.boolean(),
});

export const readingSessionSummarySchema = z.object({
  id: z.number(),
  level: CEFRLevelSchema,
  genre: ReadingGenreSchema,
  topic: z.string(),
  word_count: z.number(),
  is_custom: z.boolean(),
});

export const readingSessionDetailSchema = z.object({
  session_id: z.number(),
  content: z.string(),
  level: CEFRLevelSchema,
  genre: ReadingGenreSchema,
  topic: z.string(),
  word_count: z.number(),
  is_custom: z.boolean(),
});

export const summaryFeedbackSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const correctAnswerSchema = z.object({
  correct_option: z.string(),
  explanation: z.string(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correct_answer: correctAnswerSchema,
});

export const quizResponseSchema = z.object({
  questions: z.array(quizQuestionSchema),
});

// List response schemas
export const readingSessionListResponseSchema = createListResponseSchema(
  readingSessionSummarySchema
);

// Types
export type CEFRLevel = z.infer<typeof CEFRLevelSchema>;
export type ReadingGenre = z.infer<typeof ReadingGenreSchema>;

export type ReadingSessionCreateSchema = z.infer<typeof readingSessionCreateSchema>;
export type SummarySubmissionSchema = z.infer<typeof summarySubmissionSchema>;
export type QuizGenerationRequestSchema = z.infer<typeof quizGenerationRequestSchema>;

export type ReadingSessionResponseSchema = z.infer<typeof readingSessionResponseSchema>;
export type ReadingSessionSummarySchema = z.infer<typeof readingSessionSummarySchema>;
export type ReadingSessionDetailSchema = z.infer<typeof readingSessionDetailSchema>;
export type SummaryFeedbackSchema = z.infer<typeof summaryFeedbackSchema>;
export type CorrectAnswerSchema = z.infer<typeof correctAnswerSchema>;
export type QuizQuestionSchema = z.infer<typeof quizQuestionSchema>;
export type QuizResponseSchema = z.infer<typeof quizResponseSchema>;
export type ReadingSessionListResponseSchema = z.infer<typeof readingSessionListResponseSchema>;
