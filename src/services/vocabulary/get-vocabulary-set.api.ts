import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { VocabularySetResponseSchema } from '@/lib/schema/vocabulary.schema';
import { useQuery } from '@tanstack/react-query';

export async function getVocabularySetApi(setId: number) {
  const response = await apiClient.get<VocabularySetResponseSchema>(`/vocabulary/sets/${setId}`);
  return response.data;
}

export const useGetVocabularySetQuery = (setId: number) => {
  return useQuery<VocabularySetResponseSchema, ErrorResponseSchema>({
    queryKey: ['vocabulary-set', setId],
    queryFn: () => getVocabularySetApi(setId),
    refetchOnWindowFocus: false,
    enabled: !!setId,
  });
};
