import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  MultipleChoiceSessionResponseSchema,
  StudySessionCreateSchema,
} from '@/lib/schema/vocabulary.schema';
import { useMutation } from '@tanstack/react-query';

export async function createMultipleChoiceSessionApi(body: StudySessionCreateSchema) {
  const response = await apiClient.post<
    MultipleChoiceSessionResponseSchema,
    StudySessionCreateSchema
  >('/vocabulary/study/multiple-choice', body);
  return response.data;
}

export const useCreateMultipleChoiceSessionMutation = () => {
  return useMutation<
    MultipleChoiceSessionResponseSchema,
    ErrorResponseSchema,
    StudySessionCreateSchema
  >({
    mutationKey: ['createMultipleChoiceSession'],
    mutationFn: (body) => createMultipleChoiceSessionApi(body),
    meta: {
      ignoreGlobal: true,
    },
  });
};
