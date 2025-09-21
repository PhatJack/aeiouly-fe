import React from 'react';

import { Metadata } from 'next';

import OnionDetailPage from '../_components/OnionDetailPage';

export const metadata: Metadata = {
  title: 'Luyện nói',
  description: 'Luyện nói tiếng Anh',
};

const Page = () => {
  return <OnionDetailPage />;
};

export default Page;
