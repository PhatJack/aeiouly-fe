import React from 'react';

import { Metadata } from 'next';

import TopicPage from './_components/TopicPage';

export const metadata: Metadata = {
  title: 'Thảo luận chủ đề | Topic',
  description:
    'Thảo luận và trao đổi về các chủ đề tiếng Anh thú vị với cộng đồng. Học tiếng Anh thông qua việc chia sẻ ý kiến và giao tiếp thực tế.',
  keywords: [
    'thảo luận tiếng anh',
    'topic discussion',
    'cộng đồng tiếng anh',
    'giao tiếp tiếng anh',
    'học tiếng anh',
  ],
  openGraph: {
    title: 'Thảo luận chủ đề | Topic ',
    description:
      'Thảo luận và trao đổi về các chủ đề tiếng Anh thú vị với cộng đồng. Học tiếng Anh thông qua việc chia sẻ ý kiến và giao tiếp thực tế.',
    type: 'website',
  },
};

const Page = () => {
  return <TopicPage />;
};

export default Page;
