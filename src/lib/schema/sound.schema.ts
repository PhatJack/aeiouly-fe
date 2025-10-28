import z from 'zod';

import { createListResponseSchema } from './pagination';

// ============= Sound Schemas =============
export const soundBaseSchema = z.object({
  name: z.string().min(1, 'Tên âm thanh không được để trống'),
  sound_file_url: z.url().optional(),
  file_size: z.number().optional(),
  duration: z.number().optional(),
});

export const soundCreateSchema = z.object({
  name: z.string().min(1, 'Tên âm thanh không được để trống'),
});

export const soundUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});

export const soundResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  sound_file_url: z.string().nullable().optional(),
  file_size: z.number().nullable().optional(),
  duration: z.number().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const soundUploadResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  sound_file_url: z.string(),
  file_size: z.number(),
  duration: z.number().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const soundListResponseSchema = createListResponseSchema(soundResponseSchema);

// Sound file upload schema
export const soundFileSchema = z.object({
  sound_file: z.any().refine((file) => file instanceof File, 'Phải là file âm thanh'),
});

// ============= Type Exports =============
export type SoundBaseSchema = z.infer<typeof soundBaseSchema>;
export type SoundCreateSchema = z.infer<typeof soundCreateSchema>;
export type SoundUpdateSchema = z.infer<typeof soundUpdateSchema>;
export type SoundResponseSchema = z.infer<typeof soundResponseSchema>;
export type SoundUploadResponseSchema = z.infer<typeof soundUploadResponseSchema>;
export type SoundListResponseSchema = z.infer<typeof soundListResponseSchema>;
export type SoundFileSchema = z.infer<typeof soundFileSchema>;
