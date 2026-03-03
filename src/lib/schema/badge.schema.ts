import z from 'zod';

import { createBaseResponseSchema } from './base-response';
import { createListResponseSchema } from './pagination';

export const badgeResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  rarity: z.string(),
  category: z.string().nullable().optional(),
  badge_category_id: z.number().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export const badgeCategoryResponseSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export const userBadgeResponseSchema = z.object({
  id: z.number(),
  earned_at: z.string().or(z.date()),
  badge: badgeResponseSchema,
});

export const badgeListSchema = createListResponseSchema(badgeResponseSchema);
export const userBadgeListSchema = createListResponseSchema(userBadgeResponseSchema);
export const badgeCategoryListSchema = createListResponseSchema(badgeCategoryResponseSchema);

// Request schemas (for forms / mutation body)
export const badgeCreateSchema = z.object({
  code: z.string().min(1, 'Code không được để trống'),
  name: z.string().min(1, 'Tên badge không được để trống'),
  description: z.string().optional().nullable(),
  rarity: z.string().optional().default('common'),
  category: z.string().optional().nullable(),
  badge_category_id: z.number().int().positive().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const badgeUpdateSchema = z.object({
  name: z.string().min(1, 'Tên badge không được để trống').optional(),
  description: z.string().optional().nullable(),
  rarity: z.string().optional(),
  category: z.string().optional().nullable(),
  badge_category_id: z.number().int().positive().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const badgeCategoryCreateSchema = z.object({
  code: z.string().min(1, 'Code không được để trống'),
  name: z.string().min(1, 'Tên nhóm không được để trống'),
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const badgeCategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Tên nhóm không được để trống').optional(),
  description: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

export const grantBadgeRequestSchema = z.object({
  user_id: z.number().int().positive(),
  badge_code: z.string().min(1),
  earned_at: z.string().optional().nullable(),
});

// BaseResponse wrappers
export const badgesListResponseSchema = createBaseResponseSchema(badgeListSchema);
export const myBadgesListResponseSchema = createBaseResponseSchema(userBadgeListSchema);
export const badgeCreateResponseSchema = createBaseResponseSchema(badgeResponseSchema);
export const badgeUpdateResponseSchema = createBaseResponseSchema(badgeResponseSchema);
export const badgeGrantResponseSchema = createBaseResponseSchema(z.null());

export const badgeCategoriesListResponseSchema = createBaseResponseSchema(badgeCategoryListSchema);
export const badgeCategoryCreateResponseSchema = createBaseResponseSchema(
  badgeCategoryResponseSchema
);
export const badgeCategoryUpdateResponseSchema = createBaseResponseSchema(
  badgeCategoryResponseSchema
);

// Types
export type BadgeResponseSchema = z.infer<typeof badgeResponseSchema>;
export type UserBadgeResponseSchema = z.infer<typeof userBadgeResponseSchema>;
export type BadgeCategoryResponseSchema = z.infer<typeof badgeCategoryResponseSchema>;

export type BadgeCreateSchema = z.infer<typeof badgeCreateSchema>;
export type BadgeUpdateSchema = z.infer<typeof badgeUpdateSchema>;
export type BadgeCategoryCreateSchema = z.infer<typeof badgeCategoryCreateSchema>;
export type BadgeCategoryUpdateSchema = z.infer<typeof badgeCategoryUpdateSchema>;
export type GrantBadgeRequestSchema = z.infer<typeof grantBadgeRequestSchema>;

export type BadgesListResponseSchema = z.infer<typeof badgesListResponseSchema>;
export type MyBadgesListResponseSchema = z.infer<typeof myBadgesListResponseSchema>;
export type BadgeCreateResponseSchema = z.infer<typeof badgeCreateResponseSchema>;
export type BadgeUpdateResponseSchema = z.infer<typeof badgeUpdateResponseSchema>;
export type BadgeGrantResponseSchema = z.infer<typeof badgeGrantResponseSchema>;

export type BadgeCategoriesListResponseSchema = z.infer<typeof badgeCategoriesListResponseSchema>;
export type BadgeCategoryCreateResponseSchema = z.infer<typeof badgeCategoryCreateResponseSchema>;
export type BadgeCategoryUpdateResponseSchema = z.infer<typeof badgeCategoryUpdateResponseSchema>;
