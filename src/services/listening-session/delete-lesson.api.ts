import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteLessonApi(lessonId: number): Promise<void> {
  await apiClient.delete(`/listen-lessons/${lessonId}`);
}

export const useDeleteLessonMutation = (
  options?: Omit<
    UseMutationOptions<void, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteLesson'],
    mutationFn: (lessonId) => deleteLessonApi(lessonId),
    ...options,
  });
};
