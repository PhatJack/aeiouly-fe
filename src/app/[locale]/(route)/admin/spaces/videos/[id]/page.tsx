import React from 'react';

import EditBackgroundVideoForm from '../../_components/EditBackgroundVideoForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Chỉnh sửa video nền <span className="text-primary"> #{id}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Chỉnh sửa thông tin video và upload hình thu nhỏ
        </p>
      </div>
      <EditBackgroundVideoForm videoId={parseInt(id)} />
    </div>
  );
};

export default Page;
