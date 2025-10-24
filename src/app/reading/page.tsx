import React from 'react';

import { Metadata } from 'next';

import ReadingPage from './_components/ReadingPage';

export const metadata: Metadata = {
  title: 'Reading',
  description: 'Reading',
};

const Page = () => {
  return <ReadingPage />;
};

export default Page;
