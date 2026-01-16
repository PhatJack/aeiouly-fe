import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import OnionPage from './_components/OnionPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('speaking.metadata');

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
}

const Page = () => {
  return <OnionPage />;
};

export default Page;
