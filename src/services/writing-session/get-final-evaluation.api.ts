import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { FinalEvaluationResponseSchema } from '@/lib/schema/writing-session.schema';
import { useQuery } from '@tanstack/react-query';

export async function getFinalEvaluationApi(sessionId: number) {
  const response = await apiClient.get<FinalEvaluationResponseSchema>(
    `/writing-sessions/${sessionId}/final-evaluation`
  );
  return response.data;
}

export const useGetFinalEvaluationQuery = (sessionId: number, enabled: boolean = false) => {
  return useQuery<FinalEvaluationResponseSchema, ErrorResponseSchema>({
    queryKey: ['finalEvaluation', sessionId],
    queryFn: () => getFinalEvaluationApi(sessionId),
    enabled: !!sessionId && enabled,
  });
};
