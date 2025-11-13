import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  QuizGenerationRequestSchema,
  QuizResponseSchema,
} from '@/lib/schema/reading-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export interface GenerateQuizParams {
  sessionId: number;
  data: QuizGenerationRequestSchema;
}

export async function generateQuizApi({ sessionId, data }: GenerateQuizParams) {
  const response = await apiClient.post<QuizResponseSchema, QuizGenerationRequestSchema>(
    `/reading-sessions/${sessionId}/generate-quiz`,
    data
  );
  return response.data;
}

export const useGenerateQuizMutation = (
  options?: Omit<
    UseMutationOptions<QuizResponseSchema, ErrorResponseSchema, GenerateQuizParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<QuizResponseSchema, ErrorResponseSchema, GenerateQuizParams>({
    mutationKey: ['generateQuiz'],
    mutationFn: (params) => generateQuizApi(params),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
