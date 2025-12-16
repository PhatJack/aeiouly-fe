import React from 'react';

import DriverOnboarding from '@/components/DriverOnBoarding';
import PostsFeed from '@/components/app/home/PostsFeed';
import AIChatBox from '@/components/shared/chat/AIChatBox';

const Page = () => {
  return (
    <>
      <DriverOnboarding />
      <div className="container mx-auto max-w-2xl">
        <PostsFeed />
      </div>
      <AIChatBox />
    </>
  );
};

export default Page;
