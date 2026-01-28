import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { userResponseSchema } from '@/lib/schema/user.schema';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

export const registerBodySchema = z.object({
  email: z.email('auth.email.invalid'),
  username: z.string().min(3, 'auth.username.min'),
  full_name: z.string().min(6, 'auth.fullName.min'),
  password: z
    .string()
    .refine((str) => /.{8,}/.test(str), 'auth.password.minLength')
    .refine((str) => /[0-9]/.test(str), 'auth.password.requireNumber')
    .refine((str) => /[a-z]/.test(str), 'auth.password.requireLowercase')
    .refine((str) => /[A-Z]/.test(str), 'auth.password.requireUppercase'),
});

export type RegisterBodySchema = z.infer<typeof registerBodySchema>;

export const registerResponseSchema = createBaseResponseSchema(userResponseSchema);

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
