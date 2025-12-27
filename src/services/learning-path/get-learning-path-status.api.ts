import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LearningPathStatusResponseSchema } from '@/lib/schema/learning-path.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getLearningPathStatusApi(learningPathId?: number) {
  const response = await apiClient.get<LearningPathStatusResponseSchema>(
    `/learning-paths/${learningPathId}/status`
  );
  return response.data;
}

export const useGetLearningPathStatusQuery = (
  learningPathId?: number,
  options?: Omit<
    UseQueryOptions<LearningPathStatusResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LearningPathStatusResponseSchema, ErrorResponseSchema>({
    queryKey: ['learningPathStatus', learningPathId],
    queryFn: () => getLearningPathStatusApi(learningPathId),
    enabled: !!learningPathId,
    meta: {
      ignoreGlobal: true,
    },
    refetchInterval: (query) => {
      // Tiếp tục polling nếu is_ready là false
      if (!query.state?.data?.is_ready) {
        return 3000;
      }
      return false;
    },
    ...options,
  });
};
