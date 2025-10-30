import z from 'zod';

import { createListResponseSchema } from './pagination';

// Base schemas
export const userFavoriteVideoCreateSchema = z.object({
  youtube_url: z.string().url('URL không hợp lệ'),
});

export const userFavoriteVideoUpdateSchema = z.object({
  name: z.string().min(1, 'Tên video không được để trống').optional(),
});

// Response schema
export const userFavoriteVideoResponseSchema = z.object({
  id: z.number(),
  youtube_url: z.string(),
  name: z.string(),
  author_name: z.string(),
  author_url: z.string(),
  image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  user_id: z.number(),
});

// List response schema
export const userFavoriteVideoListResponseSchema = createListResponseSchema(
  userFavoriteVideoResponseSchema
);

// Type exports
export type UserFavoriteVideoCreateSchema = z.infer<typeof userFavoriteVideoCreateSchema>;
export type UserFavoriteVideoUpdateSchema = z.infer<typeof userFavoriteVideoUpdateSchema>;
export type UserFavoriteVideoResponseSchema = z.infer<typeof userFavoriteVideoResponseSchema>;
export type UserFavoriteVideoListResponseSchema = z.infer<
  typeof userFavoriteVideoListResponseSchema
>;
