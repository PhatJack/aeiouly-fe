import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { FinalEvaluationResponseSchema } from '@/lib/schema/speaking-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getSpeakingFinalEvaluationApi(sessionId: number) {
  const response = await apiClient.get<FinalEvaluationResponseSchema>(
    `/speaking-sessions/${sessionId}/final-evaluation`
  );
  return response.data;
}

export const useGetSpeakingFinalEvaluationQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<FinalEvaluationResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<FinalEvaluationResponseSchema, ErrorResponseSchema>({
    queryKey: ['speakingFinalEvaluation', sessionId],
    queryFn: () => getSpeakingFinalEvaluationApi(sessionId),
    enabled: !!sessionId,
    meta: { ignoreGlobal: true },
    ...options,
  });
};
