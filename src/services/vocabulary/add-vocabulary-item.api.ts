import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  VocabularyItemCreateSchema,
  VocabularyItemResponseSchema,
} from '@/lib/schema/vocabulary.schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function addVocabularyItemApi(body: VocabularyItemCreateSchema) {
  const response = await apiClient.post<VocabularyItemResponseSchema, VocabularyItemCreateSchema>(
    '/vocabulary/items',
    body
  );
  return response.data;
}

export const useAddVocabularyItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<VocabularyItemResponseSchema, ErrorResponseSchema, VocabularyItemCreateSchema>(
    {
      mutationKey: ['addVocabularyItem'],
      mutationFn: (body) => addVocabularyItemApi(body),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['vocabulary-items', data.vocabulary_set_id] });
        queryClient.invalidateQueries({ queryKey: ['vocabulary-set', data.vocabulary_set_id] });
        queryClient.invalidateQueries({ queryKey: ['vocabulary-sets'] });
      },
    }
  );
};
