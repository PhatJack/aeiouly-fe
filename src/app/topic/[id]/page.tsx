import React from 'react';

import { Metadata } from 'next';

import { getWritingSessionApi } from '@/services/writing-session';

import TopicDetailPage from '../_components/TopicDetailPage';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  try {
    const { id } = await params;
    const res = await getWritingSessionApi(Number(id));

    console.log('res.id:', res?.id); // ✅ safe
    return {
      title: `Chủ đề ${res.topic}`,
      description: `Tham gia phiên viết về chủ đề "${res.topic}" với độ khó ${res.level} trên Aeiouly.`,
    };
  } catch (error: any) {
    console.error('API Error:', error);

    return {
      title: 'Không tìm thấy chủ đề',
      description: 'Phiên viết không tồn tại hoặc đã bị xóa.',
    };
  }
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TopicDetailPage id={id} />;
};

export default Page;
