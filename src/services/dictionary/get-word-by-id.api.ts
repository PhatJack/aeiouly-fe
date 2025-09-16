import { apiClient } from '@/lib/client';
import { DictionaryResponseSchema } from '@/lib/schema/dictionary.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useQuery } from '@tanstack/react-query';

export async function getWordByIdApi(wordId: number) {
  const response = await apiClient.get<DictionaryResponseSchema>(`/dictionary/word/${wordId}`);
  return response.data;
}

export const useGetWordByIdQuery = (wordId: number, enabled = true) => {
  return useQuery<DictionaryResponseSchema, ErrorResponseSchema>({
    queryKey: ['dictionary', 'word', wordId],
    queryFn: () => getWordByIdApi(wordId),
    refetchOnWindowFocus: false,
    enabled: enabled && !!wordId,
  });
};
