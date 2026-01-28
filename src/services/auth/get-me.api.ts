import { apiClient } from '@/lib/client';
import { createBaseResponseSchema } from '@/lib/schema/base-response';
import { ErrorResponseSchema } from '@/lib/schema/error';
import { userResponseSchema } from '@/lib/schema/user.schema';
import { useQuery } from '@tanstack/react-query';

import z from 'zod';

export const getMeApi = async () => {
  const response = await apiClient.get<GetMeResponseSchema>('/auth/me');
  return response.data;
};

const getMeResponseSchema = createBaseResponseSchema(userResponseSchema);

type GetMeResponseSchema = z.infer<typeof getMeResponseSchema>;

export const useGetMeQuery = () => {
  return useQuery<GetMeResponseSchema, ErrorResponseSchema>({
    queryKey: ['me'],
    queryFn: () => getMeApi(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
