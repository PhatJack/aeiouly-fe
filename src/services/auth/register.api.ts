import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { userSchema } from "@/lib/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const registerBodySchema = z.object({
  email: z.email("Invalid email address"),
  username: z.string().min(3, "At least 3 characters"),
  full_name: z.string().min(6, "At least 6 characters"),
  password: z.string(),
});

export type RegisterBodySchema = z.infer<typeof registerBodySchema>;

export const registerResponseSchema = userSchema;

export type RegisterResponseSchema = z.infer<typeof registerResponseSchema>;

export async function registerApi(
  body: RegisterBodySchema
): Promise<RegisterResponseSchema> {
  const response = await apiClient.post<
    RegisterResponseSchema,
    RegisterBodySchema
  >("/auth/register", body);
  return response.data;
}

export const useRegisterMutation = () => {
  return useMutation<
    RegisterResponseSchema,
    ErrorResponseSchema,
    RegisterBodySchema
  >({
    mutationKey: ["register"],
    mutationFn: (body) => registerApi(body),
  });
};
