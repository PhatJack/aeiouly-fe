import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { VocabularyItemListResponseSchema } from '@/lib/schema/vocabulary.schema';
import { useQuery } from '@tanstack/react-query';

export async function getVocabularyItemsApi(setId: number, params?: PaginationRequestSchema) {
  const response = await apiClient.get<VocabularyItemListResponseSchema>(
    `/vocabulary/sets/${setId}/items`,
    params
  );
  return response.data;
}

export const useGetVocabularyItemsQuery = (setId: number, params?: PaginationRequestSchema) => {
  return useQuery<VocabularyItemListResponseSchema, ErrorResponseSchema>({
    queryKey: ['vocabulary-items', setId, params],
    queryFn: () => getVocabularyItemsApi(setId, params),
    refetchOnWindowFocus: false,
    enabled: !!setId,
  });
};
