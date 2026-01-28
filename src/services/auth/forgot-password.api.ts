import { apiClient } from '@/lib/client';
import { BaseResponseNull } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

export const requestPasswordResetSchema = z.object({
  email: z.email('auth.email.invalid'),
});

export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z.object({
  token: z.string(),
  new_password: z
    .string('auth.password.required')
    .refine((str) => /.{8,}/.test(str), 'auth.password.minLength')
    .refine((str) => /[0-9]/.test(str), 'auth.password.requireNumber')
    .refine((str) => /[a-z]/.test(str), 'auth.password.requireLowercase')
    .refine((str) => /[A-Z]/.test(str), 'auth.password.requireUppercase'),
});

export type ConfirmPasswordResetSchema = z.infer<typeof confirmPasswordResetSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string('auth.currentPassword.required'),
  new_password: z
    .string('auth.password.required')
    .refine((str) => /.{8,}/.test(str), 'auth.password.minLength')
    .refine((str) => /[0-9]/.test(str), 'auth.password.requireNumber')
    .refine((str) => /[a-z]/.test(str), 'auth.password.requireLowercase')
    .refine((str) => /[A-Z]/.test(str), 'auth.password.requireUppercase'),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export async function requestPasswordResetApi(body: RequestPasswordResetSchema) {
  const response = await apiClient.post<BaseResponseNull>('/auth/request-password-reset', body);
  return response.data;
}

export async function confirmPasswordResetApi(body: ConfirmPasswordResetSchema) {
  const response = await apiClient.post<BaseResponseNull>('/auth/reset-password', body);
  return response.data;
}

export async function changePasswordApi(body: ChangePasswordSchema) {
  const response = await apiClient.post<BaseResponseNull>('/auth/change-password', body);
  return response.data;
}

export const useConfirmPasswordResetMutation = () => {
  return useMutation<BaseResponseNull, ErrorResponseSchema, ConfirmPasswordResetSchema>({
    mutationKey: ['confirmPasswordReset'],
    mutationFn: (body: ConfirmPasswordResetSchema) => confirmPasswordResetApi(body),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<BaseResponseNull, ErrorResponseSchema, ChangePasswordSchema>({
    mutationKey: ['changePassword'],
    mutationFn: (body: ChangePasswordSchema) => changePasswordApi(body),
    meta: {
      ignoreGlobal: true,
    },
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation<BaseResponseNull, ErrorResponseSchema, RequestPasswordResetSchema>({
    mutationKey: ['requestPasswordReset'],
    mutationFn: (body: RequestPasswordResetSchema) => requestPasswordResetApi(body),
  });
};
