import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  SpeakingSessionCreateSchema,
  SpeakingSessionResponseSchema,
} from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createSpeakingSessionApi(body: SpeakingSessionCreateSchema) {
  const response = await apiClient.post<SpeakingSessionResponseSchema, SpeakingSessionCreateSchema>(
    '/speaking-sessions/',
    body
  );
  return response.data;
}

export const useCreateSpeakingSessionMutation = (
  options?: Omit<
    UseMutationOptions<
      SpeakingSessionResponseSchema,
      ErrorResponseSchema,
      SpeakingSessionCreateSchema
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<
    SpeakingSessionResponseSchema,
    ErrorResponseSchema,
    SpeakingSessionCreateSchema
  >({
    mutationKey: ['createSpeakingSession'],
    mutationFn: (body) => createSpeakingSessionApi(body),
    ...options,
  });
};
