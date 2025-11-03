import { cookies } from 'next/headers';
import { permanentRedirect } from 'next/navigation';

import { ROUTE } from '@/configs/route';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from '@/constants/cookies';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;

  if (!refreshToken && !accessToken) {
    permanentRedirect(ROUTE.AUTH.LOGIN);
  }

  return <>{children}</>;
}
