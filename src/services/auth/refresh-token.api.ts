import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';

import z from 'zod';

import { tokenDataSchema } from './login.api';

export const refreshTokenResponseSchema = createBaseResponseSchema(tokenDataSchema);

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;

export async function refreshTokenApi() {
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {});
  return response.data;
}
