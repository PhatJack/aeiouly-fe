import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { BadgeCreateResponseSchema, BadgeCreateSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function createBadgeApi(body: BadgeCreateSchema) {
  const response = await apiClient.post<BadgeCreateResponseSchema, BadgeCreateSchema>(
    '/badges/',
    body
  );
  return response.data;
}

export const useCreateBadgeMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<BadgeCreateResponseSchema, ErrorResponseSchema, BadgeCreateSchema>({
    mutationKey: ['createBadge'],
    mutationFn: (body) => createBadgeApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
    },
  });
};
