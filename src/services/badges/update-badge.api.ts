import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { BadgeUpdateResponseSchema, BadgeUpdateSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function updateBadgeApi(badgeId: number, body: BadgeUpdateSchema) {
  const response = await apiClient.put<BadgeUpdateResponseSchema, BadgeUpdateSchema>(
    `/badges/${badgeId}`,
    body
  );
  return response.data;
}

export const useUpdateBadgeMutation = () => {
  const queryClient = getQueryClient();

  return useMutation<
    BadgeUpdateResponseSchema,
    ErrorResponseSchema,
    { badgeId: number; data: BadgeUpdateSchema }
  >({
    mutationKey: ['updateBadge'],
    mutationFn: ({ badgeId, data }) => updateBadgeApi(badgeId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['badge', data.data?.id] });
    },
  });
};
