import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  EvaluateAnswerRequestSchema,
  EvaluateAnswerResponseSchema,
} from '@/lib/schema/reading-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export interface EvaluateAnswerParams {
  sessionId: number;
  data: EvaluateAnswerRequestSchema;
}

export async function evaluateAnswerApi({ sessionId, data }: EvaluateAnswerParams) {
  const response = await apiClient.post<EvaluateAnswerResponseSchema, EvaluateAnswerRequestSchema>(
    `/reading-sessions/${sessionId}/evaluate-answer`,
    data
  );
  return response.data;
}

export const useEvaluateAnswerMutation = (
  options?: Omit<
    UseMutationOptions<EvaluateAnswerResponseSchema, ErrorResponseSchema, EvaluateAnswerParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<EvaluateAnswerResponseSchema, ErrorResponseSchema, EvaluateAnswerParams>({
    mutationKey: ['evaluate-answer'],
    mutationFn: (params) => evaluateAnswerApi(params),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
