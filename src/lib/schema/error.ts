import z from "zod";

export const errorResponseSchema = z.object({
  detail: z.array(z.string()),
});

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;