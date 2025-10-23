import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function getNextSentenceApi(sessionId: number) {
  const response = await apiClient.post<SessionDetailResponseSchema>(
    `/listening-sessions/${sessionId}/next`,
    {}
  );
  return response.data;
}

export const useGetNextSentenceMutation = (
  options?: Omit<
    UseMutationOptions<SessionDetailResponseSchema, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<SessionDetailResponseSchema, ErrorResponseSchema, number>({
    mutationKey: ['getNextSentence'],
    mutationFn: (sessionId) => getNextSentenceApi(sessionId),
    ...options,
  });
};
