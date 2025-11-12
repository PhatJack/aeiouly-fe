import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  VocabularySetCreateSchema,
  VocabularySetResponseSchema,
} from '@/lib/schema/vocabulary.schema';
import { useMutation } from '@tanstack/react-query';

export async function createVocabularySetApi(body: VocabularySetCreateSchema) {
  const response = await apiClient.post<VocabularySetResponseSchema, VocabularySetCreateSchema>(
    '/vocabulary/sets',
    body
  );
  return response.data;
}

export const useCreateVocabularySetMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<VocabularySetResponseSchema, ErrorResponseSchema, VocabularySetCreateSchema>({
    mutationKey: ['createVocabularySet'],
    mutationFn: (body) => createVocabularySetApi(body),
    meta: {
      ignoreGlobal: true,
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vocabularySets'] });
    },
  });
};
