import React from 'react';

import { Metadata } from 'next';

import { getWritingSessionApi } from '@/services/writing-session';

import TopicDetailPage from '../_components/TopicDetailPage';

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const res = await getWritingSessionApi(Number(params.id));
  return {
    title: `Chủ đề ${res.topic} - Độ khó ${res.difficulty}`,
    description: `Tham gia phiên viết về chủ đề "${res.topic}" với độ khó ${res.difficulty} trên Aeiouly.`,
  };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TopicDetailPage id={id} />;
};

export default Page;
