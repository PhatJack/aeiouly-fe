import React from 'react';

import { Metadata } from 'next';

import UsersTable from './UsersTable';

export const metadata: Metadata = {
  title: 'Quản lý người dùng',
  description: 'Quản lý người dùng trong hệ thống',
};

const Page = async () => {
  return (
    <>
      <UsersTable />
    </>
  );
};

export default Page;
