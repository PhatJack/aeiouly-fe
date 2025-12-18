import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SkipCurrentSentenceParams {
  sessionId: number;
}

export async function skipCurrentSentenceApi(sessionId: number) {
  const response = await apiClient.post<ChatMessageResponseSchema, {}>(
    `/writing-sessions/${sessionId}/skip`,
    {}
  );
  return response.data;
}

export const useSkipCurrentSentenceMutation = (
  options?: Omit<
    UseMutationOptions<ChatMessageResponseSchema, ErrorResponseSchema, SkipCurrentSentenceParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  const queryClient = getQueryClient();
  return useMutation<ChatMessageResponseSchema, ErrorResponseSchema, SkipCurrentSentenceParams>({
    mutationKey: ['skipCurrentSentence'],
    mutationFn: ({ sessionId }) => skipCurrentSentenceApi(sessionId),
    meta: {
      ignoreGlobal: true,
    },
    onSuccess: (data, variables) => {
      queryClient.setQueriesData(
        { queryKey: ['chatHistory', variables.sessionId] },
        (oldData: ChatMessageResponseSchema[] | undefined) => {
          if (!oldData) return [data];
          return [...oldData, data];
        }
      );
    },
    ...options,
  });
};
