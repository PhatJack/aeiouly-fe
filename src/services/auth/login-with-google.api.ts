import { getQueryClient } from '@/app/get-query-client';
import { apiClient } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';

export async function loginWithGoogleApi(token: string) {
  const response = await apiClient.post('/auth/google', JSON.stringify({ id_token: token }));
  return response.data;
}

export const useLoginWithGoogleMutation = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['login-with-google'],
    mutationFn: (token: string) => loginWithGoogleApi(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
};
