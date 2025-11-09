import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  SummaryFeedbackSchema,
  SummarySubmissionSchema,
} from '@/lib/schema/reading-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export interface SubmitSummaryParams {
  sessionId: number;
  data: SummarySubmissionSchema;
}

export async function submitSummaryApi({ sessionId, data }: SubmitSummaryParams) {
  const response = await apiClient.post<SummaryFeedbackSchema, SummarySubmissionSchema>(
    `/reading-sessions/${sessionId}/submit-summary`,
    data
  );
  return response.data;
}

export const useSubmitSummaryMutation = (
  options?: Omit<
    UseMutationOptions<SummaryFeedbackSchema, ErrorResponseSchema, SubmitSummaryParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<SummaryFeedbackSchema, ErrorResponseSchema, SubmitSummaryParams>({
    mutationKey: ['submitSummary'],
    mutationFn: (params) => submitSummaryApi(params),
    meta: {
      ignoreGlobal: true,
    },
    ...options,
  });
};
