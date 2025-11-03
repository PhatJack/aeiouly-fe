import { cookies } from 'next/headers';
import { permanentRedirect } from 'next/navigation';

import { ROUTE } from '@/configs/route';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const refreshToken = (await cookies()).get('refreshToken')?.value;
  const accessToken = (await cookies()).get('accessToken')?.value;

  if (!refreshToken && !accessToken) {
    permanentRedirect(ROUTE.AUTH.LOGIN);
  }

  return <>{children}</>;
}
