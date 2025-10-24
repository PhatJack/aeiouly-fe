import React from 'react';

import { Metadata } from 'next';

import ReadingDetailPage from '../_components/ReadingDetailPage';

export const metadata: Metadata = {
  title: 'Reading',
  description: 'Reading',
};

const Page = () => {
  return <ReadingDetailPage />;
};

export default Page;
