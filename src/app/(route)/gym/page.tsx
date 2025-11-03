import React from 'react';

import { Metadata } from 'next';

import GymPage from './_components/GymPage';

export const metadata: Metadata = {
  title: 'Gym',
  description: 'Gym',
};

const Page = () => {
  return <GymPage />;
};

export default Page;
