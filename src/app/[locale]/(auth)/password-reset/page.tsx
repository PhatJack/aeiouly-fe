import { Suspense } from 'react';

import { Metadata } from 'next';

import Loading from '@/components/Loading';

import { PasswordResetForm } from '../_components/PasswordResetForm';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu',
};

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PasswordResetForm />
    </Suspense>
  );
}
