import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import SoloPage from './_components/SoloPage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'space' });

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

export default function Solo() {
  return <SoloPage />;
}
