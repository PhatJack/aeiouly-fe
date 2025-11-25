import z from 'zod';

import { CEFRLevelSchema, ReadingGenreSchema } from './enum.schema';
import { createListResponseSchema } from './pagination';

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

export const quizGenerationRequestSchema = z.object({
  number_of_questions: z.number().int().min(3).max(10).default(5),
});

export const discussionGenerationRequestSchema = z.object({
  number_of_questions: z.number().int().min(3).max(10).default(5),
});

export const discussionQuestionSchema = z.object({
  questionEn: z.string(),
  questionVi: z.string(),
});

export const discussionResponseSchema = z.object({
  questions: z.array(discussionQuestionSchema),
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

export const evaluateAnswerRequestSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const evaluateAnswerResponseSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const quizQuestionSchema = z.object({
  questionEn: z.string(),
  questionVi: z.string(),
  optionsEn: z.array(z.string()),
  optionsVi: z.array(z.string()),
  correctAnswer: z.number().int().min(0),
  explanationEn: z.string(),
  explanationVi: z.string(),
});

export const quizResponseSchema = z.object({
  questions: z.array(quizQuestionSchema),
});

// List response schemas
export const readingSessionListResponseSchema = createListResponseSchema(
  readingSessionSummarySchema
);

// Types
export type ReadingSessionCreateSchema = z.infer<typeof readingSessionCreateSchema>;
export type QuizGenerationRequestSchema = z.infer<typeof quizGenerationRequestSchema>;
export type DiscussionGenerationRequestSchema = z.infer<typeof discussionGenerationRequestSchema>;

export type ReadingSessionResponseSchema = z.infer<typeof readingSessionResponseSchema>;
export type ReadingSessionSummarySchema = z.infer<typeof readingSessionSummarySchema>;
export type ReadingSessionDetailSchema = z.infer<typeof readingSessionDetailSchema>;
export type EvaluateAnswerRequestSchema = z.infer<typeof evaluateAnswerRequestSchema>;
export type EvaluateAnswerResponseSchema = z.infer<typeof evaluateAnswerResponseSchema>;
export type QuizQuestionSchema = z.infer<typeof quizQuestionSchema>;
export type QuizResponseSchema = z.infer<typeof quizResponseSchema>;
export type DiscussionQuestionSchema = z.infer<typeof discussionQuestionSchema>;
export type DiscussionResponseSchema = z.infer<typeof discussionResponseSchema>;
export type ReadingSessionListResponseSchema = z.infer<typeof readingSessionListResponseSchema>;
