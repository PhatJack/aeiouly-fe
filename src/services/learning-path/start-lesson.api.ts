import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  LessonStartRequestSchema,
  UserLessonProgressResponseSchema,
} from '@/lib/schema/learning-path.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

interface StartLessonParams {
  userLessonProgressId: number;
  data: LessonStartRequestSchema;
}

export async function startLessonApi({ userLessonProgressId, data }: StartLessonParams) {
  const response = await apiClient.post<UserLessonProgressResponseSchema, LessonStartRequestSchema>(
    `/learning-paths/progress/${userLessonProgressId}/start`,
    data
  );
  return response.data;
}

export const useStartLessonMutation = (
  options?: Omit<
    UseMutationOptions<UserLessonProgressResponseSchema, ErrorResponseSchema, StartLessonParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<UserLessonProgressResponseSchema, ErrorResponseSchema, StartLessonParams>({
    mutationKey: ['startLesson'],
    mutationFn: (params) => startLessonApi(params),
    ...options,
  });
};
