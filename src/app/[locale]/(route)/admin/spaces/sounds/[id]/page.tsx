import React from 'react';

import EditSoundForm from '../../_components/EditSoundForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Chỉnh sửa âm thanh <span className="text-primary"> #{id}</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Chỉnh sửa thông tin âm thanh và upload file âm thanh
        </p>
      </div>
      <EditSoundForm soundId={parseInt(id)} />
    </div>
  );
};

export default Page;
