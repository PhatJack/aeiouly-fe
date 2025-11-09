import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  VocabularyItemCreateSchema,
  VocabularyItemResponseSchema,
} from '@/lib/schema/vocabulary.schema';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

export async function addVocabularyItemApi(body: VocabularyItemCreateSchema) {
  const response = await apiClient.post<VocabularyItemResponseSchema, VocabularyItemCreateSchema>(
    '/vocabulary/items',
    body
  );
  return response.data;
}

export const useAddVocabularyItemMutation = (
  options?: Omit<
    UseMutationOptions<
      VocabularyItemResponseSchema,
      ErrorResponseSchema,
      VocabularyItemCreateSchema
    >,
    'mutationKey' | 'mutationFn'
  >
) => {
  return useMutation<VocabularyItemResponseSchema, ErrorResponseSchema, VocabularyItemCreateSchema>(
    {
      mutationKey: ['addVocabularyItem'],
      mutationFn: (body) => addVocabularyItemApi(body),
      meta: {
        ignoreGlobal: true,
      },
      ...options,
    }
  );
};
