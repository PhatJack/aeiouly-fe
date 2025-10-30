import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllPostsApi } from '@/services/posts';

import PostsTable from './PostsTable';

const Page = async () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quản lý bài viết</CardTitle>
          <CardDescription>
            Quản lý tất cả bài viết trong hệ thống. Nhấp vào một hàng để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsTable />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;
