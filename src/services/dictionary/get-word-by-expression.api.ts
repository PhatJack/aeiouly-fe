import { apiClient } from '@/lib/client';
import {
  DictionaryResponseSchema,
  GetWordByExpressionRequestSchema,
} from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getWordByExpressionApi(params: GetWordByExpressionRequestSchema) {
  const response = await apiClient.get<DictionaryResponseSchema>('/dictionary/word', params);
  return response.data;
}

export const useGetWordByExpressionQuery = (
  params: GetWordByExpressionRequestSchema,
  enabled = true
) => {
  return useQuery<DictionaryResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'word', 'expression', params.expression],
    queryFn: () => getWordByExpressionApi(params),
    refetchOnWindowFocus: false,
    enabled: enabled && !!params.expression,
  });
};
