import { apiClient } from '@/lib/client';
import { DictionaryResponseSchema, FindWordRequestSchema } from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function findWordWithSuffixesApi(params: FindWordRequestSchema) {
  const response = await apiClient.get<DictionaryResponseSchema>('/dictionary/find', params);
  return response.data;
}

export const useFindWordWithSuffixesQuery = (params: FindWordRequestSchema, enabled = true) => {
  return useQuery<DictionaryResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'find', params.word],
    queryFn: () => findWordWithSuffixesApi(params),
    refetchOnWindowFocus: false,
    enabled: enabled && !!params.word,
  });
};
