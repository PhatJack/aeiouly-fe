import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LessonResponseSchema, LessonUpdateSchema } from '@/lib/schema/listening-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export interface UpdateLessonParams {
  lessonId: number;
  data: LessonUpdateSchema;
}

export async function updateLessonApi({ lessonId, data }: UpdateLessonParams) {
  const response = await apiClient.put<LessonResponseSchema, LessonUpdateSchema>(
    `/listen-lessons/${lessonId}`,
    data
  );
  return response.data;
}

export const useUpdateLessonMutation = (
  options?: Omit<
    UseMutationOptions<LessonResponseSchema, ErrorResponseSchema, UpdateLessonParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<LessonResponseSchema, ErrorResponseSchema, UpdateLessonParams>({
    mutationKey: ['updateLesson'],
    mutationFn: (params) => updateLessonApi(params),
    ...options,
  });
};
