import z from 'zod';

export const chatBotBodySchema = z.object({
  message: z.string(),
  conversation_id: z.string().optional(),
});

export const chatBotResponseSchema = z.object({
  response: z.string(),
  conversation_id: z.string(),
});

export type ChatBotBodySchema = z.infer<typeof chatBotBodySchema>;
export type ChatBotResponseSchema = z.infer<typeof chatBotResponseSchema>;
