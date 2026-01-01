import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LessonListResponseSchema } from '@/lib/schema/listening-session.schema';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export interface GetLessonsParams extends PaginationRequestSchema {
  level?: string;
  search?: string;
}

export async function getLessonsApi(params?: GetLessonsParams) {
  const response = await apiClient.get<LessonListResponseSchema>('/listen-lessons', params);
  return response.data;
}

export const useGetLessonsQuery = (
  params?: GetLessonsParams,
  options?: Omit<
    UseQueryOptions<LessonListResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LessonListResponseSchema, ErrorResponseSchema>({
    queryKey: ['lessons', params],
    queryFn: () => getLessonsApi(params),
    refetchOnWindowFocus: false,
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
