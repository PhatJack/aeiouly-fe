import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  ReadingSessionCreateSchema,
  ReadingSessionResponseSchema,
} from '@/lib/schema/reading-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createReadingSessionApi(body: ReadingSessionCreateSchema) {
  const response = await apiClient.post<ReadingSessionResponseSchema, ReadingSessionCreateSchema>(
    '/reading-sessions',
    body
  );
  return response.data;
}

export const useCreateReadingSessionMutation = (
  options?: Omit<
    UseMutationOptions<
      ReadingSessionResponseSchema,
      ErrorResponseSchema,
      ReadingSessionCreateSchema
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<ReadingSessionResponseSchema, ErrorResponseSchema, ReadingSessionCreateSchema>(
    {
      mutationKey: ['createReadingSession'],
      mutationFn: (body) => createReadingSessionApi(body),
      ...options,
    }
  );
};
