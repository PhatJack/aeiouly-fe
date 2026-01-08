import React from 'react';

import { Metadata } from 'next';

import VocabularyPage from './_components/VocabularyPage';

export const metadata: Metadata = {
  title: 'Từ vựng',
};

const Page = () => {
  return <VocabularyPage />;
};

export default Page;
