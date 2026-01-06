import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function deleteListeningLessonApi(lessonId: number): Promise<void> {
  await apiClient.delete(`/listening-lessons/${lessonId}`);
}

export const useDeleteListeningLessonMutation = (
  options?: Omit<
    UseMutationOptions<void, ErrorResponseSchema, number>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<void, ErrorResponseSchema, number>({
    mutationKey: ['deleteListeningLesson'],
    mutationFn: (lessonId) => deleteListeningLessonApi(lessonId),
    ...options,
  });
};
