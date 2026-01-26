import React from 'react';

import { Metadata } from 'next';

import LeaderboardPage from './_components/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Leaderboard',
  description:
    'Check out the leaderboard and see who is leading the way! Compete with learners worldwide and track your progress on the streak leaderboard.',
  keywords: [
    'leaderboard',
    'ranking',
    'streak',
    'competition',
    'learning',
    'english learning',
    'progress tracking',
  ],
  openGraph: {
    title: 'Leaderboard',
    description:
      'Compete with learners worldwide and track your progress on the streak leaderboard.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Aeiouly',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leaderboard',
    description:
      'Compete with learners worldwide and track your progress on the streak leaderboard.',
  },
};

const Page = () => {
  return <LeaderboardPage />;
};

export default Page;
