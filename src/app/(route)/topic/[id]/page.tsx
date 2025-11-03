import React from 'react';

import { Metadata } from 'next';

import { getWritingSessionApi } from '@/services/writing-session';

import TopicDetailPage from '../_components/TopicDetailPage';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  return {
    title: 'Không tìm thấy chủ đề',
    description: 'Phiên viết không tồn tại hoặc đã bị xóa.',
  };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TopicDetailPage id={id} />;
};

export default Page;
