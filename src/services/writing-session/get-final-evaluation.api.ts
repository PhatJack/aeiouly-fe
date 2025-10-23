import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { FinalEvaluationResponseSchema } from '@/lib/schema/writing-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getFinalEvaluationApi(sessionId: number) {
  const response = await apiClient.get<FinalEvaluationResponseSchema>(
    `/writing-sessions/${sessionId}/final-evaluation`
  );
  return response.data;
}

export const useGetFinalEvaluationQuery = (
  sessionId: number,
  options?: Omit<
    UseQueryOptions<FinalEvaluationResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<FinalEvaluationResponseSchema, ErrorResponseSchema>({
    queryKey: ['finalEvaluation', sessionId],
    queryFn: () => getFinalEvaluationApi(sessionId),
    enabled: !!sessionId,
    ...options,
  });
};
