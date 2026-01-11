import React from 'react';

import { Metadata } from 'next';

import GymPage from './_components/GymPage';

export const metadata: Metadata = {
  title: 'Luyện nghe tiếng Anh | Gym',
  description:
    'Luyện nghe tiếng Anh với bài tập tương tác, video YouTube và công nghệ AI. Cải thiện kỹ năng nghe hiểu với các bài học được cá nhân hóa.',
  keywords: [
    'luyện nghe tiếng anh',
    'nghe hiểu tiếng anh',
    'bài tập nghe',
    'video tiếng anh',
    'AI luyện nghe',
  ],
  openGraph: {
    title: 'Luyện nghe tiếng Anh | Gym',
    description:
      'Luyện nghe tiếng Anh với bài tập tương tác, video YouTube và công nghệ AI. Cải thiện kỹ năng nghe hiểu với các bài học được cá nhân hóa.',
    type: 'website',
  },
};

const Page = () => {
  return <GymPage />;
};

export default Page;
