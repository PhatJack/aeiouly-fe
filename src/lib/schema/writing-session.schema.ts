import z from 'zod';

import { createListResponseSchema } from './pagination';

// Enums
export const CEFRLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export const SessionStatusSchema = z.enum(['active', 'completed']);
export const MessageRoleSchema = z.enum(['user', 'assistant']);

// Create schemas
export const writingSessionCreateSchema = z.object({
  topic: z.string().min(1, 'Chủ đề không được để trống').max(255),
  difficulty: CEFRLevelSchema,
  total_sentences: z.number().int().min(1).max(20),
});

export const chatMessageCreateSchema = z.object({
  content: z.string().min(1, 'Nội dung tin nhắn không được để trống'),
});

export const sessionCompleteRequestSchema = z.object({
  force_complete: z.boolean().optional().default(false),
});

// Response schemas
export const writingSessionResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  topic: z.string(),
  difficulty: CEFRLevelSchema,
  total_sentences: z.number(),
  current_sentence_index: z.number(),
  status: SessionStatusSchema,
  vietnamese_text: z.string(),
  vietnamese_sentences: z.array(z.string()),
  current_sentence: z.string().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable().optional(),
});

export const writingSessionListItemSchema = z.object({
  id: z.number(),
  topic: z.string(),
  difficulty: CEFRLevelSchema,
  total_sentences: z.number(),
  current_sentence_index: z.number(),
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
});

export const chatMessageResponseSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  role: MessageRoleSchema,
  content: z.string(),
  sentence_index: z.number().nullable().optional(),
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
});

export const hintResponseSchema = z.object({
  hint: z.string(),
  sentence_index: z.number(),
});

export const finalEvaluationResponseSchema = z.object({
  session_id: z.number(),
  total_sentences: z.number(),
  completed_sentences: z.number(),
  overall_score: z.number().min(0).max(100),
  accuracy_score: z.number().min(0).max(100),
  fluency_score: z.number().min(0).max(100),
  vocabulary_score: z.number().min(0).max(100),
  grammar_score: z.number().min(0).max(100),
  feedback: z.string(),
  suggestions: z.array(z.string()),
  completed_at: z.string().or(z.date()),
});

export const writingSessionListResponseSchema = createListResponseSchema(
  writingSessionListItemSchema
);

// Types
export type CEFRLevel = z.infer<typeof CEFRLevelSchema>;
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export type WritingSessionCreateSchema = z.infer<typeof writingSessionCreateSchema>;
export type ChatMessageCreateSchema = z.infer<typeof chatMessageCreateSchema>;
export type SessionCompleteRequestSchema = z.infer<typeof sessionCompleteRequestSchema>;

export type WritingSessionResponseSchema = z.infer<typeof writingSessionResponseSchema>;
export type WritingSessionListItemSchema = z.infer<typeof writingSessionListItemSchema>;
export type ChatMessageResponseSchema = z.infer<typeof chatMessageResponseSchema>;
export type HintResponseSchema = z.infer<typeof hintResponseSchema>;
export type FinalEvaluationResponseSchema = z.infer<typeof finalEvaluationResponseSchema>;
export type WritingSessionListResponseSchema = z.infer<typeof writingSessionListResponseSchema>;
