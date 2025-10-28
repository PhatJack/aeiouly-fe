import z from 'zod';

import { createListResponseSchema } from './pagination';

// Session Goals Status enum
export const sessionGoalsStatusSchema = z.enum(['OPEN', 'COMPLETED']);

// ============= Session Goal Schemas =============
export const sessionGoalBaseSchema = z.object({
  goal: z.string().min(1, 'Mục tiêu không được để trống').max(255),
  status: sessionGoalsStatusSchema.default('OPEN'),
});

export const sessionGoalCreateSchema = z.object({
  goal: z.string().min(1, 'Mục tiêu không được để trống').max(255),
  status: sessionGoalsStatusSchema.default('OPEN').optional(),
});

export const sessionGoalUpdateSchema = z.object({
  goal: z.string().min(1).max(255).optional(),
  status: sessionGoalsStatusSchema.optional(),
});

export const sessionGoalResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  goal: z.string(),
  status: sessionGoalsStatusSchema,
  created_at: z.string().or(z.date()),
  updated_at: z.string().or(z.date()),
});

export const sessionGoalListResponseSchema = createListResponseSchema(sessionGoalResponseSchema);

// ============= Type Exports =============
export type SessionGoalsStatusSchema = z.infer<typeof sessionGoalsStatusSchema>;
export type SessionGoalBaseSchema = z.infer<typeof sessionGoalBaseSchema>;
export type SessionGoalCreateSchema = z.infer<typeof sessionGoalCreateSchema>;
export type SessionGoalUpdateSchema = z.infer<typeof sessionGoalUpdateSchema>;
export type SessionGoalResponseSchema = z.infer<typeof sessionGoalResponseSchema>;
export type SessionGoalListResponseSchema = z.infer<typeof sessionGoalListResponseSchema>;
