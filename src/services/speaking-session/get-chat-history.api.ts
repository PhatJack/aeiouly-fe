import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { SpeakingChatMessageResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getSpeakingChatHistoryApi(sessionId: number) {
  const response = await apiClient.get<SpeakingChatMessageResponseSchema[]>(
    `/speaking-sessions/${sessionId}/chat`
  );
  return response.data;
}

export const useGetSpeakingChatHistoryQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<SpeakingChatMessageResponseSchema[], ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<SpeakingChatMessageResponseSchema[], ErrorResponseSchema>({
    queryKey: ['speakingChatHistory', sessionId],
    queryFn: () => getSpeakingChatHistoryApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
