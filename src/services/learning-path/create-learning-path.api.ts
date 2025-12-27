import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  LearningPathFormSchema,
  LearningPathResponseSchema,
} from '@/lib/schema/learning-path.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function createLearningPathApi(body: LearningPathFormSchema) {
  const response = await apiClient.post<LearningPathResponseSchema, LearningPathFormSchema>(
    '/learning-paths/',
    body
  );
  return response.data;
}

export const useCreateLearningPathMutation = (
  options?: Omit<
    UseMutationOptions<LearningPathResponseSchema, ErrorResponseSchema, LearningPathFormSchema>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<LearningPathResponseSchema, ErrorResponseSchema, LearningPathFormSchema>({
    mutationKey: ['createLearningPath'],
    mutationFn: (body) => createLearningPathApi(body),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
