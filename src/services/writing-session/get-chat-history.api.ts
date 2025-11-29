import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { ChatMessageResponseSchema } from '@/lib/schema/writing-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getWritingChatHistoryApi(sessionId: number) {
  const response = await apiClient.get<ChatMessageResponseSchema[]>(
    `/writing-sessions/${sessionId}/chat`
  );
  return response.data;
}

export const useGetWritingChatHistoryQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<ChatMessageResponseSchema[], ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<ChatMessageResponseSchema[], ErrorResponseSchema>({
    queryKey: ['chatHistory', sessionId],
    queryFn: () => getWritingChatHistoryApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
