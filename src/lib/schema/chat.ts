import z from 'zod';

export const chatBodySchema = z.object({
  message: z.string(),
  user_id: z.number(),
});

export type ChatBodySchema = z.infer<typeof chatBodySchema>;
