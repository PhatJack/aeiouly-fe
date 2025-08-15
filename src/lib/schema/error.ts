import z from "zod";

export const errorResponseSchema = z.object({
  detail: z.array(z.object({
		loc: z.array(z.string()),
		msg: z.string(),
		type: z.string().optional(),
	})),
});

export type ErrorResponseSchema = z.infer<typeof errorResponseSchema>;