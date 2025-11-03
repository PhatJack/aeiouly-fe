import React from 'react';

import { Metadata } from 'next';

import ReadingDetailPage from '../_components/ReadingDetailPage';

export const metadata: Metadata = {
  title: 'Reading Session',
  description: 'Reading practice session detail',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <ReadingDetailPage id={id} />;
};

export default Page;
