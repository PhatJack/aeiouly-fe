import React from 'react';

import { Metadata } from 'next';

import SpacePage from './_components/SpacePage';

export const metadata: Metadata = {
  title: 'Quản lý không gian học tập',
  description: 'Quản lý không gian học tập trong hệ thống',
};

const Page = () => {
  return <SpacePage />;
};

export default Page;
