import React from 'react';

import { cookies } from 'next/headers';

import { COOKIE_KEY_ACCESS_TOKEN } from '@/constants/cookies';
import { serverAxios } from '@/lib/client';
import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';

import GymDetailPage from '../_components/GymDetailPage';

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value || '';

  const result = await serverAxios.get<SessionDetailResponseSchema>(`/listening-sessions/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const session = result.data;

  return {
    title: session.lesson.title,
    openGraph: {
      title: session.lesson.title,
    },
  };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <GymDetailPage id={id} />;
};

export default Page;
