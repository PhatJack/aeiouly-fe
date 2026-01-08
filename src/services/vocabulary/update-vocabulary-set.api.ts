import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import {
  VocabularySetResponseSchema,
  VocabularySetUpdateSchema,
} from '@/lib/schema/vocabulary.schema';
import { useMutation } from '@tanstack/react-query';

export async function updateVocabularySetApi(setId: number, body: VocabularySetUpdateSchema) {
  const response = await apiClient.put<VocabularySetResponseSchema, VocabularySetUpdateSchema>(
    `/vocabulary/sets/${setId}`,
    body
  );
  return response.data;
}

export const useUpdateVocabularySetMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    VocabularySetResponseSchema,
    ErrorResponseSchema,
    { setId: number; data: VocabularySetUpdateSchema }
  >({
    mutationKey: ['updateVocabularySet'],
    mutationFn: ({ setId, data }) => updateVocabularySetApi(setId, data),
    meta: {
      ignoreGlobal: true,
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vocabulary-set', data.id] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary-sets'] });
    },
  });
};
