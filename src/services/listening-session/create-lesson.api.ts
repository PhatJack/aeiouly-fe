import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createLessonApi(formData: FormData) {
  const response = await apiClient.post<LessonResponseSchema, FormData>(
    '/listen-lessons',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}

export const useCreateLessonMutation = (
  options?: Omit<
    UseMutationOptions<LessonResponseSchema, ErrorResponseSchema, FormData>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<LessonResponseSchema, ErrorResponseSchema, FormData>({
    mutationKey: ['createLesson'],
    mutationFn: (formData) => createLessonApi(formData),
    ...options,
  });
};
