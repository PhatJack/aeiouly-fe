import React from 'react';

import EditBackgroundVideoTypeForm from '../../_components/EditBackgroundVideoTypeForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Chỉnh sửa loại video <span className="text-primary"> #{id}</span>
        </h1>
        <p className="text-muted-foreground mt-2">Chỉnh sửa thông tin loại video</p>
      </div>
      <EditBackgroundVideoTypeForm typeId={parseInt(id)} />
    </div>
  );
};

export default Page;
