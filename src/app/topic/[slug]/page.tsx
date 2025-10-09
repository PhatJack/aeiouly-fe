import React from 'react';

import { Metadata } from 'next';

import TopicDetailPage from '../_components/TopicDetailPage';

export const metadata: Metadata = {
  title: 'Topic',
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <TopicDetailPage slug={slug} />;
};

export default Page;
