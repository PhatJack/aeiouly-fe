import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from '@/constants/cookies';

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
};
