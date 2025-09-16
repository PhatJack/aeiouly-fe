import { apiClient } from '@/lib/client';
import {
  DictionarySearchRequestSchema,
  DictionarySearchResponseSchema,
} from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function searchWordsApi(params: DictionarySearchRequestSchema) {
  const response = await apiClient.get<DictionarySearchResponseSchema>(
    '/dictionary/search',
    params
  );
  return response.data;
}

export const useSearchWordsQuery = (params: DictionarySearchRequestSchema, enabled = true) => {
  return useQuery<DictionarySearchResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'search', params],
    queryFn: () => searchWordsApi(params),
    refetchOnWindowFocus: false,
    enabled: enabled && !!params.query,
  });
};
