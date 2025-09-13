import React from 'react';

import { Metadata } from 'next';

import SettingPage from './_components/SettingPage';

export const metadata: Metadata = {
  title: 'Cài đặt',
  description: 'Cài đặt tài khoản của bạn',
};

const Page = () => {
  return <SettingPage />;
};

export default Page;
