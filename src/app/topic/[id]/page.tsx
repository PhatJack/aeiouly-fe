import React from 'react';

import { Metadata } from 'next';

import TopicDetailPage from '../_components/TopicDetailPage';

export const metadata: Metadata = {
  title: 'Topic',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <TopicDetailPage id={id} />;
};

export default Page;
