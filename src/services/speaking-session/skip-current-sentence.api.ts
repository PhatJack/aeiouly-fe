import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SpeakingChatMessageResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface SkipCurrentSentenceParams {
  sessionId: number;
}

export async function skipCurrentSpeakingSentenceApi(sessionId: number) {
  const response = await apiClient.post<SpeakingChatMessageResponseSchema, {}>(
    `/speaking-sessions/${sessionId}/skip`,
    {}
  );
  return response.data;
}

export const useSkipCurrentSpeakingSentenceMutation = (
  options?: Omit<
    UseMutationOptions<
      SpeakingChatMessageResponseSchema,
      ErrorResponseSchema,
      SkipCurrentSentenceParams
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  const queryClient = getQueryClient();
  return useMutation<
    SpeakingChatMessageResponseSchema,
    ErrorResponseSchema,
    SkipCurrentSentenceParams
  >({
    mutationKey: ['skipCurrentSpeakingSentence'],
    mutationFn: ({ sessionId }) => skipCurrentSpeakingSentenceApi(sessionId),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
