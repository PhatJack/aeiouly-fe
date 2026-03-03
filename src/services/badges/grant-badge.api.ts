import { apiClient } from '@/lib/client';
import { BadgeGrantResponseSchema, GrantBadgeRequestSchema } from '@/lib/schema/badge.schema';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { useMutation } from '@tanstack/react-query';

export async function grantBadgeApi(body: GrantBadgeRequestSchema) {
  const response = await apiClient.post<BadgeGrantResponseSchema, GrantBadgeRequestSchema>(
    '/badges/grant',
    body
  );
  return response.data;
}

export const useGrantBadgeMutation = () => {
  return useMutation<BadgeGrantResponseSchema, ErrorResponseSchema, GrantBadgeRequestSchema>({
    mutationKey: ['grantBadge'],
    mutationFn: (body) => grantBadgeApi(body),
  });
};
