import React from 'react';

import { Metadata } from 'next';

import PostsTable from './PostsTable';

export const metadata: Metadata = {
  title: 'Quản lý bài viết',
  description: 'Quản lý bài viết trong hệ thống',
};

const Page = async () => {
  return (
    <>
      <PostsTable />
    </>
  );
};

export default Page;
