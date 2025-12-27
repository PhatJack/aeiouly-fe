import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UserLessonProgressResponseSchema } from '@/lib/schema/learning-path.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function completeLessonApi(userLessonProgressId: number) {
  const response = await apiClient.post<UserLessonProgressResponseSchema>(
    `/learning-paths/progress/${userLessonProgressId}/complete`,
    {}
  );
  return response.data;
}

export const useCompleteLessonMutation = (
  options?: Omit<
    UseMutationOptions<UserLessonProgressResponseSchema, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<UserLessonProgressResponseSchema, ErrorResponseSchema, number>({
    mutationKey: ['completeLesson'],
    mutationFn: (userLessonProgressId) => completeLessonApi(userLessonProgressId),
    ...options,
  });
};
