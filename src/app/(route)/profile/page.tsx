import React from 'react';

import { Metadata } from 'next';

import ProfilePage from './_components/ProfilePage';

export const metadata: Metadata = {
  title: 'Hồ sơ cá nhân',
};

const Page = () => {
  return <ProfilePage />;
};

export default Page;
