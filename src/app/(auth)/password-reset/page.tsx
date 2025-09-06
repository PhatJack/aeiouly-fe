import { Suspense } from 'react';

import { Metadata } from 'next';

import CutoutTextLoader from '@/components/Loading';

import { PasswordResetForm } from '../_components/PasswordResetForm';

export const metadata: Metadata = {
  title: 'Password Reset',
};

export default function PasswordResetPage() {
  return (
    <Suspense
      fallback={<CutoutTextLoader height="450px" background="white" imgUrl="background.gif" />}
    >
      <PasswordResetForm />
    </Suspense>
  );
}
