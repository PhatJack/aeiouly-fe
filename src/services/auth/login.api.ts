import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import z from 'zod';

export const loginBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginBodySchema = z.infer<typeof loginBodySchema>;

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number(),
});

export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;

export async function loginApi(body: LoginBodySchema) {
  const response = await apiClient.post<LoginResponseSchema, LoginBodySchema>('/auth/login', body);
  return response.data;
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponseSchema, ErrorResponseSchema, LoginBodySchema>({
    mutationKey: ['login'],
    mutationFn: (body) => loginApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
