import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ROUTE } from '@/configs/route';
import { COOKIE_KEY_ACCESS_TOKEN, COOKIE_KEY_REFRESH_TOKEN } from '@/constants/cookies';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const refreshToken = (await cookies()).get(COOKIE_KEY_REFRESH_TOKEN)?.value;
  if (!accessToken && !refreshToken) redirect(ROUTE.AUTH.LOGIN);

  return <>{children}</>;
}
