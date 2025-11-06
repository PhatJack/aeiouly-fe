import React from 'react';

import { cookies } from 'next/headers';

import { COOKIE_KEY_ACCESS_TOKEN } from '@/constants/cookies';
import { serverAxios } from '@/lib/client';
import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';

import GymDetailPage from '../_components/GymDetailPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  // const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value;
  // let gymData = null;
  // if (accessToken) {
  //   serverAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  //   gymData = await serverAxios.get<SessionDetailResponseSchema>(`/listening-sessions/${id}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }
  // console.log('gymData', gymData);
  return <GymDetailPage id={id} />;
};

export default Page;
