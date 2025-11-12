import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  DiscussionGenerationRequestSchema,
  DiscussionResponseSchema,
} from '@/lib/schema/reading-session.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export interface GenerateDiscussionParams {
  sessionId: number;
  data: DiscussionGenerationRequestSchema;
}

export async function generateDiscussionApi({ sessionId, data }: GenerateDiscussionParams) {
  const response = await apiClient.post<
    DiscussionResponseSchema,
    DiscussionGenerationRequestSchema
  >(`/reading-sessions/${sessionId}/generate-discussion`, data);
  return response.data;
}

export const useGenerateDiscussionMutation = (
  options?: Omit<
    UseMutationOptions<DiscussionResponseSchema, ErrorResponseSchema, GenerateDiscussionParams>,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<DiscussionResponseSchema, ErrorResponseSchema, GenerateDiscussionParams>({
    mutationKey: ['generate-discussion'],
    mutationFn: (params) => generateDiscussionApi(params),
    meta: {
      ignoreGlobal: true,
    },
    retry: false,
    ...options,
  });
};
