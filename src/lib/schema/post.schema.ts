import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/image';

import z from 'zod';

import { createListResponseSchema } from './pagination';

// Base schemas
export const postBaseSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống'),
  image_url: z.string().optional(),
  is_published: z.boolean(),
});

export const postCreateSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống'),
  image: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Tối đa kích thước ảnh là 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Chỉ hỗ trợ định dạng .jpg, .jpeg, .png.'
    )
    .optional(),
  is_published: z.boolean(),
});

export const postCreateImageSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});

export const postUpdateSchema = z.object({
  content: z.string().min(1, 'Nội dung không được để trống').optional(),
  image: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, `Tối đa kích thước ảnh là 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Chỉ hỗ trợ định dạng .jpg, .jpeg, .png.'
    )
    .optional(),
  is_published: z.boolean().optional(),
});

// Author schema for nested object
export const authorResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  full_name: z.string().nullable().optional(),
});

export const postResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  image_url: z.string().optional(),
  is_published: z.boolean(),
  author: authorResponseSchema, // Nested author object thay vì flat fields
  likes_count: z.number(),
  is_liked_by_user: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable(),
});

export const postListResponseSchema = createListResponseSchema(postResponseSchema);

export const postLikeResponseSchema = z.object({
  post_id: z.number(),
  is_liked: z.boolean(),
  likes_count: z.number(),
});

// Types
export type AuthorResponseSchema = z.infer<typeof authorResponseSchema>;
export type PostCreateSchema = z.infer<typeof postCreateSchema>;
export type PostCreateImageSchema = z.infer<typeof postCreateImageSchema>;
export type PostUpdateSchema = z.infer<typeof postUpdateSchema>;
export type PostResponseSchema = z.infer<typeof postResponseSchema>;
export type PostListResponseSchema = z.infer<typeof postListResponseSchema>;
export type PostLikeResponseSchema = z.infer<typeof postLikeResponseSchema>;
