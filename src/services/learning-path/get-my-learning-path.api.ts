import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LearningPathResponseSchema } from '@/lib/schema/learning-path.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getMyLearningPathApi() {
  const response = await apiClient.get<LearningPathResponseSchema>('/learning-paths/me');
  return response.data;
}

export const useGetMyLearningPathQuery = (
  options?: Omit<
    UseQueryOptions<LearningPathResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LearningPathResponseSchema, ErrorResponseSchema>({
    queryKey: ['myLearningPath'],
    queryFn: () => getMyLearningPathApi(),
    refetchOnWindowFocus: false,
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
