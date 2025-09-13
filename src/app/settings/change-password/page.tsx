import React from 'react';

import { Metadata } from 'next';

import ChangePasswordPage from '../_components/ChangePasswordPage';

export const metadata: Metadata = {
  title: 'Thay đổi mật khẩu',
  description: 'Thay đổi mật khẩu tài khoản của bạn',
};

const Page = () => {
  return <ChangePasswordPage />;
};

export default Page;
