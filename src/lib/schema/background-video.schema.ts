import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/image';

import z from 'zod';

import { createListResponseSchema } from './pagination';

// ============= Background Video Type Schemas =============
export const backgroundVideoTypeBaseSchema = z.object({
  name: z.string().max(100, 'Tên loại video không được quá 100 ký tự'),
  description: z.string().optional(),
});

export const backgroundVideoTypeCreateSchema = z.object({
  name: z.string().max(100, 'Tên loại video không được quá 100 ký tự'),
  description: z.string().optional(),
});

export const backgroundVideoTypeUpdateSchema = z.object({
  name: z.string().max(100).optional(),
  description: z.string().optional(),
});

export const backgroundVideoTypeResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const backgroundVideoTypeListResponseSchema = createListResponseSchema(
  backgroundVideoTypeResponseSchema
);

// ============= Background Video Schemas =============
export const backgroundVideoBaseSchema = z.object({
  youtube_url: z.url('URL không hợp lệ').max(500),
  image_url: z.url().max(500).optional(),
  type_id: z.number(),
});

export const backgroundVideoCreateSchema = z.object({
  youtube_url: z.url('URL YouTube không hợp lệ').max(500),
  type_id: z.number(),
});

export const backgroundVideoUpdateSchema = z.object({
  youtube_url: z.url().max(500).optional(),
  image_url: z.url().max(500).optional(),
  type_id: z.number().optional(),
});

export const backgroundVideoResponseSchema = z.object({
  id: z.number(),
  youtube_url: z.string(),
  image_url: z.string().nullable().optional(),
  type_id: z.number(),
  type_name: z.string().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const backgroundVideoListResponseSchema = createListResponseSchema(
  backgroundVideoResponseSchema
);

// Image upload schema
export const backgroundVideoImageSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Kích thước hình ảnh tối đa là 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Chỉ hỗ trợ định dạng .jpg, .jpeg, .png'
    ),
});

// ============= Type Exports =============
export type BackgroundVideoTypeBaseSchema = z.infer<typeof backgroundVideoTypeBaseSchema>;
export type BackgroundVideoTypeCreateSchema = z.infer<typeof backgroundVideoTypeCreateSchema>;
export type BackgroundVideoTypeUpdateSchema = z.infer<typeof backgroundVideoTypeUpdateSchema>;
export type BackgroundVideoTypeResponseSchema = z.infer<typeof backgroundVideoTypeResponseSchema>;
export type BackgroundVideoTypeListResponseSchema = z.infer<
  typeof backgroundVideoTypeListResponseSchema
>;

export type BackgroundVideoBaseSchema = z.infer<typeof backgroundVideoBaseSchema>;
export type BackgroundVideoCreateSchema = z.infer<typeof backgroundVideoCreateSchema>;
export type BackgroundVideoUpdateSchema = z.infer<typeof backgroundVideoUpdateSchema>;
export type BackgroundVideoResponseSchema = z.infer<typeof backgroundVideoResponseSchema>;
export type BackgroundVideoListResponseSchema = z.infer<typeof backgroundVideoListResponseSchema>;
export type BackgroundVideoImageSchema = z.infer<typeof backgroundVideoImageSchema>;
