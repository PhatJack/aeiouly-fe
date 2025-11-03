import React from 'react';

import { Metadata } from 'next';

import DeleteAccountPage from '../_components/DeleteAccountPage';

export const metadata: Metadata = {
  title: 'Xóa tài khoản',
  description: 'Xóa tài khoản',
};

const Page = () => {
  return <DeleteAccountPage />;
};

export default Page;
