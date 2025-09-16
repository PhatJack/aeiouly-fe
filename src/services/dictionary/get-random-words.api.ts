import { apiClient } from '@/lib/client';
import { DictionaryResponseSchema, RandomWordsRequestSchema } from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getRandomWordsApi(params?: RandomWordsRequestSchema) {
  const response = await apiClient.get<DictionaryResponseSchema[]>('/dictionary/random', params);
  return response.data;
}

export const useGetRandomWordsQuery = (params?: RandomWordsRequestSchema, enabled = true) => {
  return useQuery<DictionaryResponseSchema[], ErrorResponseSchema>({
    queryKey: ['dictionary', 'random', params?.limit || 10],
    queryFn: () => getRandomWordsApi(params),
    refetchOnWindowFocus: false,
    enabled,
  });
};
