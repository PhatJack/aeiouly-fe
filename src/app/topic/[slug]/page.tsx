import React from 'react';

import { Metadata } from 'next';

import DetailPage from '../_components/DetailPage';

export const metadata: Metadata = {
  title: 'Topic',
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  return <DetailPage slug={slug} />;
};

export default Page;
