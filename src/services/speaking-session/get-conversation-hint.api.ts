import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { HintResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getConversationHintApi(sessionId: number) {
  const response = await apiClient.get<HintResponseSchema>(`/speaking-sessions/${sessionId}/hint`);
  return response.data;
}

export const useGetConversationHintQuery = (
  sessionId: number,
  options?: Omit<UseQueryOptions<HintResponseSchema, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<HintResponseSchema, ErrorResponseSchema>({
    queryKey: ['speakingConversationHint', sessionId],
    queryFn: () => getConversationHintApi(sessionId),
    enabled: !!sessionId,
    meta: { ignoreGlobal: true },
    ...options,
  });
};
