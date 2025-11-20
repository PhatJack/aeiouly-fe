import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { HintResponseSchema } from '@/lib/schema/writing-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getTranslationHintApi(sessionId: number) {
  const response = await apiClient.get<HintResponseSchema>(`/writing-sessions/${sessionId}/hint`);
  return response.data;
}

export const useGetTranslationHintQuery = (
  sessionId: number,
  options?: Omit<UseQueryOptions<HintResponseSchema, ErrorResponseSchema>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<HintResponseSchema, ErrorResponseSchema>({
    queryKey: ['translationHint', sessionId],
    queryFn: () => getTranslationHintApi(sessionId),
    enabled: !!sessionId,
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
