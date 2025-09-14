import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { userSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

export const registerBodySchema = z.object({
  email: z.email('Email không hợp lệ'),
  username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  full_name: z.string().min(6, 'Tên đầy đủ phải có ít nhất 6 ký tự'),
  password: z
    .string()
    .refine((str) => /.{8,}/.test(str), 'Ít nhất 8 ký tự')
    .refine((str) => /[0-9]/.test(str), 'Ít nhất 1 số')
    .refine((str) => /[a-z]/.test(str), 'Ít nhất 1 chữ cái thường')
    .refine((str) => /[A-Z]/.test(str), 'Ít nhất 1 chữ cái hoa'),
});

export type RegisterBodySchema = z.infer<typeof registerBodySchema>;

export const registerResponseSchema = userSchema;

export type RegisterResponseSchema = z.infer<typeof registerResponseSchema>;

export async function registerApi(body: RegisterBodySchema): Promise<RegisterResponseSchema> {
  const response = await apiClient.post<RegisterResponseSchema, RegisterBodySchema>(
    '/auth/register',
    body
  );
  return response.data;
}

export const useRegisterMutation = () => {
  return useMutation<RegisterResponseSchema, ErrorResponseSchema, RegisterBodySchema>({
    mutationKey: ['register'],
    mutationFn: (body) => registerApi(body),
  });
};
