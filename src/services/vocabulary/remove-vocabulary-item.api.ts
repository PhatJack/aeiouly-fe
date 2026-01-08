import { getQueryClient } from '@/lib/get-query-client';
import { apiClient } from '@/lib/client';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function removeVocabularyItemApi(itemId: number) {
  const response = await apiClient.delete<{ message: string }>(`/vocabulary/items/${itemId}`);
  return response.data;
}

export const useRemoveVocabularyItemMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<{ message: string }, ErrorResponseSchema, number>({
    mutationKey: ['removeVocabularyItem'],
    mutationFn: (itemId) => removeVocabularyItemApi(itemId),
    onSuccess: (data, variables) => {
      queryClient.setQueriesData({ queryKey: ['vocabulary-items'] }, (oldData: any) => {
        if (!oldData) return oldData;
        const { items, ...rest } = oldData;
        return {
          ...rest,
          items: items.filter((item: any) => item.id !== variables),
        };
      });
    },
  });
};
