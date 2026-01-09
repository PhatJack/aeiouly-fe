import React from 'react';

import DriverOnboarding from '@/components/DriverOnBoarding';
import PostsFeed from '@/components/app/home/PostsFeed';

import Leaderboard from './_components/Leaderboard';

const Page = () => {
  return (
    <>
      <DriverOnboarding />
      <div className="flex w-full">
        <div className="container mx-auto max-w-2xl flex-1">
          <PostsFeed />
        </div>
        <Leaderboard />
      </div>
    </>
  );
};

export default Page;
