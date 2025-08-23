import z from "zod";

export const userSchema = z.object({
  id: z.number().min(1, "Invalid ID"),
	avatar: z.url().optional(),
  email: z.email("Invalid email address"),
  username: z.string().min(3, "At least 3 characters"),
  full_name: z.string().min(6, "At least 6 characters"),
  is_active: z.boolean(),
});

export type UserSchema = z.infer<typeof userSchema>;