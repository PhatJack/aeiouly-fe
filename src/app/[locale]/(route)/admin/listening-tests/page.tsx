import React from 'react';

import { Metadata } from 'next';

import ListeningTestsTable from './ListeningTestsTable';

export const metadata: Metadata = {
  title: 'Quản lý bài nghe',
  description: 'Quản lý bài nghe trong hệ thống',
};

const Page = async () => {
  return (
    <>
      <ListeningTestsTable />
    </>
  );
};

export default Page;
