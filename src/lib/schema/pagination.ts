import z from 'zod';

export const paginationResponseSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1'),
  size: z.number().min(1, 'Page size must be at least 1'),
  total: z.number().min(0, 'Total must be at least 0'),
  pages: z.number().min(0, 'Pages must be at least 0'),
});

export function createListResponseSchema<T extends z.ZodTypeAny>(ItemSchema: T) {
  return paginationResponseSchema.extend({
    items: z.array(ItemSchema).catch([]),
  });
}

export const paginationRequestSchema = z.object({
  page: z.number().int().positive().optional(),
  size: z.number().int().positive().optional(),
  search: z.string().optional(),
  ordering: z.string().optional(),
});

export const userFilterRequestSchema = paginationRequestSchema.extend({
  role: z.enum(['user', 'admin']).optional(),
  is_active: z.boolean().optional(),
  query: z.string().optional(),
});

export type PaginationRequestSchema = z.infer<typeof paginationRequestSchema>;
export type UserFilterRequestSchema = z.infer<typeof userFilterRequestSchema>;

export type PaginationResponseSchema = z.infer<typeof createListResponseSchema>;
