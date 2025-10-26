import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function deleteVocabularySetApi(setId: number) {
  const response = await apiClient.delete<{ message: string }>(`/vocabulary/sets/${setId}`);
  return response.data;
}

export const useDeleteVocabularySetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['deleteVocabularySet'],
    mutationFn: (setId) => deleteVocabularySetApi(setId),
    onSuccess: (_, setId) => {
      queryClient.removeQueries({ queryKey: ['vocabulary-set', setId] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary-sets'] });
    },
  });
};
