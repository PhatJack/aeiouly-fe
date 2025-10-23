import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface CompleteSessionResponse {
  message: string;
}

export async function completeWritingSessionApi(sessionId: number) {
  const response = await apiClient.post<CompleteSessionResponse, never>(
    `/writing-sessions/${sessionId}/complete`,
    {} as never
  );
  return response.data;
}

export const useCompleteWritingSessionMutation = (
  options?: Omit<
    UseMutationOptions<CompleteSessionResponse, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<CompleteSessionResponse, ErrorResponseSchema, number>({
    mutationKey: ['completeWritingSession'],
    mutationFn: (sessionId) => completeWritingSessionApi(sessionId),
    ...options,
  });
};
