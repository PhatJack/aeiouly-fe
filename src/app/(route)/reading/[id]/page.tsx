import React from 'react';

import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { COOKIE_KEY_ACCESS_TOKEN } from '@/constants/cookies';
import { serverAxios } from '@/lib/client';
import { ReadingSessionDetailSchema } from '@/lib/schema/reading-session.schema';

import ReadingDetailPage from '../_components/ReadingDetailPage';

export const metadata: Metadata = {
  title: 'Reading Session',
  description: 'Reading practice session detail',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const accessToken = (await cookies()).get(COOKIE_KEY_ACCESS_TOKEN)?.value || '';

  const result = await serverAxios.get<ReadingSessionDetailSchema>(`/reading-sessions/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const session = result.data;

  return {
    title: `${session.topic} - ${session.level}`,
    openGraph: {
      title: `${session.topic} - ${session.level}`,
    },
  };
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ReadingDetailPage id={id} />;
};

export default Page;
