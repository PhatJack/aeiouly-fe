import React from 'react';

import GymDetailPage from '../_components/GymDetailPage';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <GymDetailPage id={id} />;
};

export default Page;
