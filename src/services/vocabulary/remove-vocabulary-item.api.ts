import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function removeVocabularyItemApi(itemId: number) {
  const response = await apiClient.delete<{ message: string }>(`/vocabulary/items/${itemId}`);
  return response.data;
}

export const useRemoveVocabularyItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['removeVocabularyItem'],
    mutationFn: (itemId) => removeVocabularyItemApi(itemId),
    onSuccess: () => {
      // Invalidate all vocabulary-related queries
      queryClient.invalidateQueries({ queryKey: ['vocabulary-items'] });
      queryClient.invalidateQueries({ queryKey: ['vocabulary-sets'] });
    },
  });
};
