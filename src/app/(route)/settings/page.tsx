import React from 'react';

import { Metadata } from 'next';

import SettingPage from './_components/SettingPage';

export const metadata: Metadata = {
  title: 'Cài đặt tài khoản',
  description:
    'Quản lý cài đặt tài khoản, thay đổi mật khẩu và tùy chỉnh trải nghiệm học tiếng Anh của bạn trên Aeiouly.',
  keywords: ['cài đặt tài khoản', 'thay đổi mật khẩu', 'quản lý tài khoản', 'cài đặt ứng dụng'],
  openGraph: {
    title: 'Cài đặt tài khoản',
    description:
      'Quản lý cài đặt tài khoản, thay đổi mật khẩu và tùy chỉnh trải nghiệm học tiếng Anh của bạn trên Aeiouly.',
    type: 'website',
  },
};

const Page = () => {
  return <SettingPage />;
};

export default Page;
