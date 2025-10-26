import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { PaginationRequestSchema } from '@/lib/schema/pagination';
import { VocabularySetListResponseSchema } from '@/lib/schema/vocabulary.schema';
import { useQuery } from '@tanstack/react-query';

export async function getAllVocabularySetsApi(params?: PaginationRequestSchema) {
  const response = await apiClient.get<VocabularySetListResponseSchema>('/vocabulary/sets', params);
  return response.data;
}

export const useGetAllVocabularySetsQuery = (params?: PaginationRequestSchema) => {
  return useQuery<VocabularySetListResponseSchema, ErrorResponseSchema>({
    queryKey: ['vocabulary-sets', params],
    queryFn: () => getAllVocabularySetsApi(params),
    refetchOnWindowFocus: false,
  });
};
