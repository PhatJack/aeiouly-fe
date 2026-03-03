import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import {
  BadgeCategoryUpdateResponseSchema,
  BadgeCategoryUpdateSchema,
} from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function updateBadgeCategoryApi(categoryId: number, body: BadgeCategoryUpdateSchema) {
  const response = await apiClient.put<
    BadgeCategoryUpdateResponseSchema,
    BadgeCategoryUpdateSchema
  >(`/badges/categories/${categoryId}`, body);
  return response.data;
}

export const useUpdateBadgeCategoryMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    BadgeCategoryUpdateResponseSchema,
    ErrorResponseSchema,
    { categoryId: number; data: BadgeCategoryUpdateSchema }
  >({
    mutationKey: ['updateBadgeCategory'],
    mutationFn: ({ categoryId, data }) => updateBadgeCategoryApi(categoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeCategories'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
};
