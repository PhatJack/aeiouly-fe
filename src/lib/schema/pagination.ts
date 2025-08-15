import z from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1, "Page must be at least 1"),
  size: z.number().min(1, "Page size must be at least 1").optional(),
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
