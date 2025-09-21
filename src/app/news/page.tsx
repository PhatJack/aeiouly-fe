import React from 'react';

import { Metadata } from 'next';

import NewsPage from './_components/NewsPage';

export const metadata: Metadata = {
  title: 'Tin tức',
  description: 'Tin tức',
};

const Page = () => {
  return <NewsPage />;
};

export default Page;
