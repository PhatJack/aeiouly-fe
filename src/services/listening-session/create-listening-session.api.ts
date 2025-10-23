import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SessionCreateSchema, SessionResponseSchema } from '@/lib/schema/listening-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createListeningSessionApi(body: SessionCreateSchema) {
  const response = await apiClient.post<SessionResponseSchema, SessionCreateSchema>(
    '/listening-sessions',
    body
  );
  return response.data;
}

export const useCreateListeningSessionMutation = (
  options?: Omit<
    UseMutationOptions<SessionResponseSchema, ErrorResponseSchema, SessionCreateSchema>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<SessionResponseSchema, ErrorResponseSchema, SessionCreateSchema>({
    mutationKey: ['createListeningSession'],
    mutationFn: (body) => createListeningSessionApi(body),
    ...options,
  });
};
