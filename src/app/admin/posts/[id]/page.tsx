import React from 'react';

import EditPost from '@/components/app/news/EditPost';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Chỉnh sửa bài viết <span className="text-primary"> #{id}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Chỉnh sửa thông tin bài viết</p>
      </div>
      <EditPost postId={parseInt(id)} />
    </div>
  );
};

export default Page;
