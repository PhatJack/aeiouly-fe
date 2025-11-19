import React from 'react';

import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { COOKIE_KEY_ACCESS_TOKEN } from '@/constants/cookies';
import { serverAxios } from '@/lib/client';
import { WritingSessionResponseSchema } from '@/lib/schema/writing-session.schema';

import TopicDetailPage from '../_components/TopicDetailPage';

// export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
//   const { id } = await params;
//   const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value || '';
//   const result = await serverAxios.get<WritingSessionResponseSchema>(`/writing-sessions/${id}`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });

//   const session = result.data;

//   return {
//     title: `${session.topic} - ${session.level}`,
//     openGraph: {
//       title: `${session.topic} - ${session.level}`,
//     },
//   };
// };
const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TopicDetailPage id={id} />;
};

export default Page;
