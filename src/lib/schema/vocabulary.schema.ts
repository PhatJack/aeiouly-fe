import z from 'zod';

import { createListResponseSchema } from './pagination';

// ============= Vocabulary Set Schemas =============
export const vocabularySetBaseSchema = z.object({
  name: z.string().min(1, 'Tên bộ từ vựng không được để trống').max(200),
  description: z.string().optional(),
});

export const vocabularySetCreateSchema = vocabularySetBaseSchema;

export const vocabularySetUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
});

export const vocabularySetResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_default: z.boolean(),
  total_words: z.number(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const vocabularySetListResponseSchema = createListResponseSchema(
  vocabularySetResponseSchema
);

// ============= Vocabulary Item Schemas =============
export const vocabularyItemCreateSchema = z.object({
  vocabulary_set_id: z.number().optional(),
  dictionary_id: z.number(),
  use_default_set: z.boolean().default(false),
});

export const vocabularyItemResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  vocabulary_set_id: z.number(),
  dictionary_id: z.number(),
  word: z.string().nullable().optional(),
  definitions: z.string().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const vocabularyItemListResponseSchema = createListResponseSchema(
  vocabularyItemResponseSchema
);

// ============= Vocabulary Progress Schemas =============
export const vocabularyProgressUpdateSchema = z.object({
  mastery_level: z.number().min(0).max(5),
});

export const vocabularyProgressResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  vocabulary_item_id: z.number(),
  mastery_level: z.number(),
  review_count: z.number(),
  last_reviewed_at: z.string().or(z.date()).nullable().optional(),
  next_review_at: z.string().or(z.date()).nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

// ============= Study Session Schemas =============
export const studySessionCreateSchema = z.object({
  vocabulary_set_id: z.number(),
  max_items: z.number().min(1).max(50).default(20).optional(),
});

// ============= Flashcard Schemas =============
export const flashcardResponseSchema = z.object({
  id: z.number(),
  word: z.string(),
  definitions: z.string(),
});

export const flashcardSessionResponseSchema = z.object({
  session_id: z.string(),
  vocabulary_set_id: z.number(),
  total_cards: z.number(),
  current_card: z.number(),
  cards: z.array(flashcardResponseSchema),
});

// ============= Multiple Choice Schemas =============
export const multipleChoiceOptionSchema = z.object({
  option_id: z.string(),
  text: z.string(),
  is_correct: z.boolean(),
});

export const multipleChoiceQuestionSchema = z.object({
  id: z.number(),
  word: z.string(),
  options: z.array(multipleChoiceOptionSchema),
});

export const multipleChoiceSessionResponseSchema = z.object({
  session_id: z.string(),
  vocabulary_set_id: z.number(),
  total_questions: z.number(),
  current_question: z.number(),
  questions: z.array(multipleChoiceQuestionSchema),
});

export const answerSubmissionSchema = z.object({
  session_id: z.string(),
  question_id: z.number(),
  selected_option_id: z.string(),
  is_correct: z.boolean(),
});

export const studyResultResponseSchema = z.object({
  session_id: z.string(),
  total_questions: z.number(),
  correct_answers: z.number(),
  accuracy: z.number(),
  updated_items: z.array(vocabularyItemResponseSchema),
});

// ============= Type Exports =============
export type VocabularySetBaseSchema = z.infer<typeof vocabularySetBaseSchema>;
export type VocabularySetCreateSchema = z.infer<typeof vocabularySetCreateSchema>;
export type VocabularySetUpdateSchema = z.infer<typeof vocabularySetUpdateSchema>;
export type VocabularySetResponseSchema = z.infer<typeof vocabularySetResponseSchema>;
export type VocabularySetListResponseSchema = z.infer<typeof vocabularySetListResponseSchema>;

export type VocabularyItemCreateSchema = z.infer<typeof vocabularyItemCreateSchema>;
export type VocabularyItemResponseSchema = z.infer<typeof vocabularyItemResponseSchema>;
export type VocabularyItemListResponseSchema = z.infer<typeof vocabularyItemListResponseSchema>;

export type VocabularyProgressUpdateSchema = z.infer<typeof vocabularyProgressUpdateSchema>;
export type VocabularyProgressResponseSchema = z.infer<typeof vocabularyProgressResponseSchema>;

export type StudySessionCreateSchema = z.infer<typeof studySessionCreateSchema>;

export type FlashcardResponseSchema = z.infer<typeof flashcardResponseSchema>;
export type FlashcardSessionResponseSchema = z.infer<typeof flashcardSessionResponseSchema>;

export type MultipleChoiceOptionSchema = z.infer<typeof multipleChoiceOptionSchema>;
export type MultipleChoiceQuestionSchema = z.infer<typeof multipleChoiceQuestionSchema>;
export type MultipleChoiceSessionResponseSchema = z.infer<
  typeof multipleChoiceSessionResponseSchema
>;
export type AnswerSubmissionSchema = z.infer<typeof answerSubmissionSchema>;
export type StudyResultResponseSchema = z.infer<typeof studyResultResponseSchema>;
