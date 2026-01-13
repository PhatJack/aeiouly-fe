import React from 'react';

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DeleteAccountPage from '../_components/DeleteAccountPage';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('setting');

  return {
    title: t('deleteAccountTitle'),
    description: t('deleteAccountWarning'),
  };
}

const Page = () => {
  return <DeleteAccountPage />;
};

export default Page;
