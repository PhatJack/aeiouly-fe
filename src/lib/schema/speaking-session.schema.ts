import z from 'zod';

import { CEFRLevelSchema, MessageRoleSchema, SessionStatusSchema } from './enum.schema';
import { createListResponseSchema } from './pagination';

export const speakingSessionCreateSchema = z.object({
  my_character: z.string().min(1).max(255),
  ai_character: z.string().min(1).max(255),
  scenario: z.string().min(1),
  level: CEFRLevelSchema,
});

export const chatMessageCreateSchema = z.object({
  content: z.string().min(1).optional(), // optional because audio may be sent instead
});

export const speechToTextRequestSchema = z.object({
  language_code: z.string().default('en-US'),
});

// Response schemas
export const speakingSessionResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  my_character: z.string(),
  ai_character: z.string(),
  scenario: z.string(),
  level: CEFRLevelSchema,
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable().optional(),
});

export const speakingSessionListItemSchema = z.object({
  id: z.number(),
  my_character: z.string(),
  ai_character: z.string(),
  scenario: z.string(),
  level: CEFRLevelSchema,
  status: SessionStatusSchema,
  created_at: z.string().or(z.date()),
});

export const speakingChatMessageResponseSchema = z.object({
  id: z.number(),
  session_id: z.number(),
  role: MessageRoleSchema,
  content: z.string(),
  is_audio: z.boolean(),
  audio_url: z.string().nullable().optional(),
  translation_sentence: z.string().nullable().optional(),
  session: speakingSessionResponseSchema.optional(),
  created_at: z.string().or(z.date()),
});

export const hintResponseSchema = z.object({
  hint: z.string(),
  last_ai_message: z.string(),
});

export const finalEvaluationResponseSchema = z.object({
  session_id: z.number(),
  overall_score: z.number().min(0).max(100),
  pronunciation_score: z.number().min(0).max(100),
  fluency_score: z.number().min(0).max(100),
  vocabulary_score: z.number().min(0).max(100),
  grammar_score: z.number().min(0).max(100),
  interaction_score: z.number().min(0).max(100),
  feedback: z.string(),
  suggestions: z.array(z.string()),
  completed_at: z.string().or(z.date()),
});

export const speechToTextResponseSchema = z.object({
  text: z.string(),
});

export const speakingSessionListResponseSchema = createListResponseSchema(
  speakingSessionListItemSchema
);

// Types
export type SpeakingSessionCreateSchema = z.infer<typeof speakingSessionCreateSchema>;
export type ChatMessageCreateSchema = z.infer<typeof chatMessageCreateSchema>;
export type SpeechToTextRequestSchema = z.infer<typeof speechToTextRequestSchema>;
export type SpeakingSessionResponseSchema = z.infer<typeof speakingSessionResponseSchema>;
export type SpeakingSessionListItemSchema = z.infer<typeof speakingSessionListItemSchema>;
export type SpeakingChatMessageResponseSchema = z.infer<typeof speakingChatMessageResponseSchema>;
export type HintResponseSchema = z.infer<typeof hintResponseSchema>;
export type FinalEvaluationResponseSchema = z.infer<typeof finalEvaluationResponseSchema>;
export type SpeechToTextResponseSchema = z.infer<typeof speechToTextResponseSchema>;
export type SpeakingSessionListResponseSchema = z.infer<typeof speakingSessionListResponseSchema>;
