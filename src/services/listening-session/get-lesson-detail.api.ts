import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LessonDetailResponseSchema } from '@/lib/schema/listening-session.schema';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export async function getLessonDetailApi(lessonId: number) {
  const response = await apiClient.get<LessonDetailResponseSchema>(`/listen-lessons/${lessonId}`);
  return response.data;
}

export const useGetLessonDetailQuery = (
  lessonId: number,
  options?: Omit<
    UseQueryOptions<LessonDetailResponseSchema, ErrorResponseSchema>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LessonDetailResponseSchema, ErrorResponseSchema>({
    queryKey: ['lessonDetail', lessonId],
    queryFn: () => getLessonDetailApi(lessonId),
    enabled: !!lessonId,
    ...options,
  });
};
