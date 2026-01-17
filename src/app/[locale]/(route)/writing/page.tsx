import React from 'react';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import TopicPage from './_components/TopicPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('writing');

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: t.raw('metadata.keywords'),
    openGraph: {
      title: t('metadata.title'),
      description: t('metadata.description'),
      type: 'website',
    },
  };
}

const Page = () => {
  return <TopicPage />;
};

export default Page;
