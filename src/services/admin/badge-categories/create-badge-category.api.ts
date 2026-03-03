import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import {
  BadgeCategoryCreateResponseSchema,
  BadgeCategoryCreateSchema,
} from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function createBadgeCategoryApi(body: BadgeCategoryCreateSchema) {
  const response = await apiClient.post<
    BadgeCategoryCreateResponseSchema,
    BadgeCategoryCreateSchema
  >('/badges/categories', body);
  return response.data;
}

export const useCreateBadgeCategoryMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    BadgeCategoryCreateResponseSchema,
    ErrorResponseSchema,
    BadgeCategoryCreateSchema
  >({
    mutationKey: ['createBadgeCategory'],
    mutationFn: (body) => createBadgeCategoryApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeCategories'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
};
