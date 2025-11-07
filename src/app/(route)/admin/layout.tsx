import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { COOKIE_KEY_ACCESS_TOKEN } from '@/constants/cookies';
import { serverAxios } from '@/lib/client';
import { UserSchema } from '@/lib/schema/user.schema';
import { getMeApi } from '@/services/auth/get-me.api';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  const user = await serverAxios.get<UserSchema>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (user.data.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
