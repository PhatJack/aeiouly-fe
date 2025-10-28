import z from 'zod';

import { createListResponseSchema } from './pagination';

// User role enum
export const userRoleSchema = z.enum(['user', 'admin']);

// Base user schema
export const userBaseSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.email('Email không hợp lệ'),
  full_name: z.string().optional(),
  role: userRoleSchema.default('user'),
  is_active: z.boolean().default(true),
});

// User create schema
export const userCreateSchema = z.object({
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  email: z.email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  full_name: z.string().optional(),
  // Note: role is always USER and cannot be set via API
});

// User update schema
export const userUpdateSchema = z.object({
  email: z.email('Email không hợp lệ').optional(),
  full_name: z.string().optional(),
  is_active: z.boolean().optional(),
  // Note: role cannot be changed via API
});

// User reset password schema
export const userResetPasswordSchema = z.object({
  new_password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

// User response schema
export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.email(),
  full_name: z.string().nullable().optional(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

// User list response schema
export const userListResponseSchema = createListResponseSchema(userResponseSchema);

// Legacy schema for backwards compatibility
export const userSchema = userResponseSchema;

// Type exports
export type UserRoleSchema = z.infer<typeof userRoleSchema>;
export type UserBaseSchema = z.infer<typeof userBaseSchema>;
export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type UserResetPasswordSchema = z.infer<typeof userResetPasswordSchema>;
export type UserResponseSchema = z.infer<typeof userResponseSchema>;
export type UserListResponseSchema = z.infer<typeof userListResponseSchema>;
export type UserSchema = z.infer<typeof userSchema>;
