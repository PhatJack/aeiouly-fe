import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

export const requestPasswordResetSchema = z.object({
  email: z.email('Email không hợp lệ'),
});

export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>;

export const confirmPasswordResetSchema = z.object({
  token: z.string(),
  new_password: z
    .string('Mật khẩu mới là bắt buộc')
    .refine((str) => /.{8,}/.test(str), 'Ít nhất 8 ký tự')
    .refine((str) => /[0-9]/.test(str), 'Ít nhất 1 số')
    .refine((str) => /[a-z]/.test(str), 'Ít nhất 1 chữ cái thường')
    .refine((str) => /[A-Z]/.test(str), 'Ít nhất 1 chữ cái hoa'),
});

export type ConfirmPasswordResetSchema = z.infer<typeof confirmPasswordResetSchema>;

export const changePasswordSchema = z.object({
  current_password: z.string('Mật khẩu hiện tại là bắt buộc'),
  new_password: z
    .string('Mật khẩu mới là bắt buộc')
    .refine((str) => /.{8,}/.test(str), 'Ít nhất 8 ký tự')
    .refine((str) => /[0-9]/.test(str), 'Ít nhất 1 số')
    .refine((str) => /[a-z]/.test(str), 'Ít nhất 1 chữ cái thường')
    .refine((str) => /[A-Z]/.test(str), 'Ít nhất 1 chữ cái hoa'),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export async function requestPasswordResetApi(body: RequestPasswordResetSchema) {
  const response = await apiClient.post('/auth/password-reset-request', body);
  return response.data;
}

export async function confirmPasswordResetApi(body: ConfirmPasswordResetSchema) {
  const response = await apiClient.post('/auth/password-reset-confirm', body);
  return response.data;
}

export async function changePasswordApi(body: ChangePasswordSchema) {
  const response = await apiClient.post('/auth/change-password', body);
  return response.data;
}

export const useConfirmPasswordResetMutation = () => {
  return useMutation<any, ErrorResponseSchema, ConfirmPasswordResetSchema>({
    mutationKey: ['confirmPasswordReset'],
    mutationFn: (body: ConfirmPasswordResetSchema) => confirmPasswordResetApi(body),
  });
};

export const useChangePasswordMutation = () => {
  return useMutation<any, ErrorResponseSchema, ChangePasswordSchema>({
    mutationKey: ['changePassword'],
    mutationFn: (body: ChangePasswordSchema) => changePasswordApi(body),
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation<any, ErrorResponseSchema, RequestPasswordResetSchema>({
    mutationKey: ['requestPasswordReset'],
    mutationFn: (body: RequestPasswordResetSchema) => requestPasswordResetApi(body),
  });
};
