import React from 'react';

import { Metadata } from 'next';

import BadgesAdmin from './BadgesAdmin';

export const metadata: Metadata = {
  title: 'Quản lý danh hiệu',
  description: 'Quản lý danh hiệu và nhóm danh hiệu trong hệ thống',
};

const Page = async () => {
  return (
    <>
      <BadgesAdmin />
    </>
  );
};

export default Page;
