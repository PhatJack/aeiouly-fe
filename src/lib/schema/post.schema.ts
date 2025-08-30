import z from "zod";
import { createListResponseSchema } from "./pagination";

// Base schemas
export const postBaseSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề quá dài"),
  content: z.string().min(1, "Nội dung không được để trống"),
  is_published: z.boolean(),
});

export const postCreateSchema = postBaseSchema;

export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(200, "Tiêu đề quá dài")
    .optional(),
  content: z.string().min(1, "Nội dung không được để trống").optional(),
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
  title: z.string(),
  content: z.string(),
  is_published: z.boolean(),
  author: authorResponseSchema, // Nested author object thay vì flat fields
  likes_count: z.number(),
  is_liked_by_user: z.boolean().nullable().optional(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()).nullable(),
});

export const postListResponseSchema =
  createListResponseSchema(postResponseSchema);

export const postLikeResponseSchema = z.object({
  post_id: z.number(),
  is_liked: z.boolean(),
  likes_count: z.number(),
});

// Types
export type AuthorResponseSchema = z.infer<typeof authorResponseSchema>;
export type PostCreateSchema = z.infer<typeof postCreateSchema>;
export type PostUpdateSchema = z.infer<typeof postUpdateSchema>;
export type PostResponseSchema = z.infer<typeof postResponseSchema>;
export type PostListResponseSchema = z.infer<typeof postListResponseSchema>;
export type PostLikeResponseSchema = z.infer<typeof postLikeResponseSchema>;
