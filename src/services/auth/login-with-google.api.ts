import { apiClient } from '@/lib/client';
import { useMutation } from '@tanstack/react-query';

import { setCookie } from 'cookies-next';

export async function loginWithGoogleApi(token: string) {
  const response = await apiClient.post('/auth/google', JSON.stringify({ id_token: token }));
  return response.data;
}

export const useLoginWithGoogleMutation = () => {
  return useMutation({
    mutationKey: ['login-with-google'],
    mutationFn: (token: string) => loginWithGoogleApi(token),
    onSuccess: () => {
      setCookie('isLoggedIn', '1', {
        expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), // 7 days
      });
    },
  });
};
