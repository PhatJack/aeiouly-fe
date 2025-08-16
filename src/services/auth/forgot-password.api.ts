import { apiClient } from "@/lib/client";
import { ErrorResponseSchema } from "@/lib/schema/error";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const requestPasswordResetSchema = z.object({
  email: z.email("Invalid email address"),
});

export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;

export const confirmPasswordResetSchema = z.object({
  token: z.string(),
  new_password: z.string(),
});

export type ConfirmPasswordResetSchema = z.infer<
  typeof confirmPasswordResetSchema
>;

export const changePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export async function requestPasswordResetApi(
  body: RequestPasswordResetSchema
) {
  const response = await apiClient.post("/auth/password-reset-request", body);
  return response.data;
}

export async function confirmPasswordResetApi(
  body: ConfirmPasswordResetSchema
) {
  const response = await apiClient.post("/auth/password-reset-confirm", body);
  return response.data;
}

export async function changePasswordApi(body: ChangePasswordSchema) {
  const response = await apiClient.post("/auth/change-password", body);
  return response.data;
}

export const useConfirmPasswordResetMutation = () => {
  return useMutation<any, ErrorResponseSchema, ConfirmPasswordResetSchema>({
    mutationKey: ["confirmPasswordReset"],
    mutationFn: (body: ConfirmPasswordResetSchema) =>
      confirmPasswordResetApi(body),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<any, ErrorResponseSchema, ChangePasswordSchema>({
    mutationKey: ["changePassword"],
    mutationFn: (body: ChangePasswordSchema) => changePasswordApi(body),
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation<any, ErrorResponseSchema, RequestPasswordResetSchema>({
    mutationKey: ["requestPasswordReset"],
    mutationFn: (body: RequestPasswordResetSchema) =>
      requestPasswordResetApi(body),
  });
};
