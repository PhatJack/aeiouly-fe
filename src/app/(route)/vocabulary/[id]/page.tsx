import React from 'react';

import VocabularyDetailPage from '../_components/VocabularyDetailPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <VocabularyDetailPage id={id} />;
};

export default Page;
