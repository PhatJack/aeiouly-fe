import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

import z from 'zod';

export const loginBodySchema = z.object({
  username: z.string().min(1, 'auth.username.required'),
  password: z.string().min(1, 'auth.password.required'),
});

export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export const tokenDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number(),
});

export const loginResponseSchema = createBaseResponseSchema(tokenDataSchema);

export type TokenDataSchema = z.infer<typeof tokenDataSchema>;
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

export async function loginApi(body: LoginBodySchema) {
  const response = await apiClient.post<LoginResponseSchema, LoginBodySchema>('/auth/login', body);
  return response.data;
}

export const useLoginMutation = () => {
  const queryClient = getQueryClient();
  return useMutation<LoginResponseSchema, ErrorResponseSchema, LoginBodySchema>({
    mutationKey: ['login'],
    mutationFn: (body) => loginApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
