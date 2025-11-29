import React from 'react';

import { Metadata } from 'next';

import OnionDetailPage from '../_components/OnionDetailPage';

export const metadata: Metadata = {
  title: 'Luyện nói',
  description: 'Luyện nói tiếng Anh',
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <OnionDetailPage id={id} />;
};

export default Page;
