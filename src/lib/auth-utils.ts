import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from '@/constants/cookies';

import { deleteCookie } from 'cookies-next';

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.replace('/login');
  }
};

export const clearCookies = () => {
  deleteCookie(COOKIE_KEY_ACCESS_TOKEN);
  deleteCookie(COOKIE_KEY_REFRESH_TOKEN);
  deleteCookie('isLoggedIn');
};
