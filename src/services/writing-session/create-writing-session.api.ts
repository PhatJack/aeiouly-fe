import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  WritingSessionCreateSchema,
  WritingSessionResponseSchema,
} from '@/lib/schema/writing-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createWritingSessionApi(body: WritingSessionCreateSchema) {
  const response = await apiClient.post<WritingSessionResponseSchema, WritingSessionCreateSchema>(
    '/writing-sessions/',
    body
  );
  return response.data;
}

export const useCreateWritingSessionMutation = (
  options?: Omit<
    UseMutationOptions<
      WritingSessionResponseSchema,
      ErrorResponseSchema,
      WritingSessionCreateSchema
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<WritingSessionResponseSchema, ErrorResponseSchema, WritingSessionCreateSchema>(
    {
      mutationKey: ['createWritingSession'],
      mutationFn: (body) => createWritingSessionApi(body),
      ...options,
    }
  );
};
