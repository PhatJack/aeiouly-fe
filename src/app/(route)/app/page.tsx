import React from 'react';

import DriverOnboarding from '@/components/DriverOnBoarding';
import PostsFeed from '@/components/app/home/PostsFeed';

const Page = () => {
  return (
    <>
      <DriverOnboarding />
      <div className="container mx-auto max-w-2xl">
        <PostsFeed />
      </div>
    </>
  );
};

export default Page;
