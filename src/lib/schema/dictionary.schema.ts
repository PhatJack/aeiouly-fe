import z from 'zod';

import { createListResponseSchema } from './pagination';

// Base dictionary response schema
export const dictionaryResponseSchema = z.object({
  id: z.number(),
  expression: z.string(),
  definitions: z.string(),
});

// Dictionary search request schema
export const dictionarySearchRequestSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

// Dictionary search response schema
export const dictionarySearchResponseSchema = createListResponseSchema(dictionaryResponseSchema);

export const dictionaryTranslateRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  source_language: z.string().min(2).max(5).optional().default('vi'),
  target_language: z.string().min(2).max(5).optional().default('en'),
});

export const dictionaryTranslateResponseSchema = z.object({
  original_text: z.string(),
  translated_text: z.string(),
  source_language: z.string(),
  target_language: z.string(),
});

// Random words request schema
export const randomWordsRequestSchema = z.object({
  limit: z.number().int().min(1).max(50).optional().default(10),
});

// Find word request schema
export const findWordRequestSchema = z.object({
  word: z.string().min(1).max(50),
});

// Get word by expression request schema
export const getWordByExpressionRequestSchema = z.object({
  expression: z.string().min(1),
});

// Dictionary stats response schema
export const dictionaryStatsResponseSchema = z.object({
  overview: z.object({
    total_words: z.number(),
    message: z.string(),
  }),
  definition_stats: z.object({
    average_length: z.number(),
    longest_definition: z.object({
      word: z.string().nullable(),
      length: z.number(),
    }),
    shortest_definition: z.object({
      word: z.string().nullable(),
      length: z.number(),
    }),
  }),
  letter_distribution: z.array(
    z.object({
      letter: z.string(),
      count: z.number(),
    })
  ),
  word_length_distribution: z.array(
    z.object({
      length: z.number(),
      count: z.number(),
    })
  ),
  database_info: z.object({
    table_name: z.string(),
    indexes: z.array(z.string()),
    search_method: z.string(),
  }),
});

export const cambridgePronunciationDataSchema = z.object({
  pos: z.string(),
  lang: z.string().optional(),
  url: z.url(),
  pron: z.string(),
});

export const cambridgeExampleDataSchema = z.object({
  id: z.number(),
  text: z.string(),
  translation: z.string().optional(),
});

export const cambridgeDefinitionDataSchema = z.object({
  id: z.number(),
  pos: z.string(),
  source: z.string().optional(),
  text: z.string(),
  translation: z.string().optional(),
  example: z.array(cambridgeExampleDataSchema),
});

export const cambridgeDictionaryResponseSchema = z.object({
  word: z.string(),
  pos: z.array(z.string()),
  // verbs: z.array(cambridgeVerbDataSchema),
  pronunciation: z.array(cambridgePronunciationDataSchema),
  definition: z.array(cambridgeDefinitionDataSchema),
});

export const cambridgeDictionaryErrorSchema = z.object({
  error: z.string(),
});

// Cambridge dictionary lookup request schema
export const cambridgeDictionaryLookupRequestSchema = z.object({
  entry: z.string().min(1).max(100),
  language: z.enum(['en', 'uk', 'en-vi']),
});

// Types
export type DictionaryResponseSchema = z.infer<typeof dictionaryResponseSchema>;
export type DictionarySearchRequestSchema = z.infer<typeof dictionarySearchRequestSchema>;
export type DictionarySearchResponseSchema = z.infer<typeof dictionarySearchResponseSchema>;
export type RandomWordsRequestSchema = z.infer<typeof randomWordsRequestSchema>;
export type FindWordRequestSchema = z.infer<typeof findWordRequestSchema>;
export type GetWordByExpressionRequestSchema = z.infer<typeof getWordByExpressionRequestSchema>;
export type DictionaryStatsResponseSchema = z.infer<typeof dictionaryStatsResponseSchema>;
export type DictionaryTranslateRequestSchema = z.infer<typeof dictionaryTranslateRequestSchema>;
export type DictionaryTranslateResponseSchema = z.infer<typeof dictionaryTranslateResponseSchema>;

// Cambridge Dictionary types
export type CambridgePronunciationData = z.infer<typeof cambridgePronunciationDataSchema>;
export type CambridgeExampleData = z.infer<typeof cambridgeExampleDataSchema>;
export type CambridgeDefinitionData = z.infer<typeof cambridgeDefinitionDataSchema>;
export type CambridgeDictionaryResponse = z.infer<typeof cambridgeDictionaryResponseSchema>;
export type CambridgeDictionaryError = z.infer<typeof cambridgeDictionaryErrorSchema>;
export type CambridgeDictionaryLookupRequest = z.infer<
  typeof cambridgeDictionaryLookupRequestSchema
>;
