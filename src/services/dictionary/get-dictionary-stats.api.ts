import { apiClient } from '@/lib/client';
import { DictionaryStatsResponseSchema } from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getDictionaryStatsApi() {
  const response = await apiClient.get<DictionaryStatsResponseSchema>('/dictionary/stats');
  return response.data;
}

export const useGetDictionaryStatsQuery = (enabled = true) => {
  return useQuery<DictionaryStatsResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'stats'],
    queryFn: () => getDictionaryStatsApi(),
    refetchOnWindowFocus: false,
    enabled,
    // Cache for 5 minutes since stats don't change frequently
    staleTime: 5 * 60 * 1000,
  });
};
