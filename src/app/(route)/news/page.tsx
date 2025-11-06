import React from 'react';

import { Metadata } from 'next';

import NewsPage from './_components/NewsPage';

export const metadata: Metadata = {
  title: 'Tin tức tiếng Anh | News',
  description:
    'Đọc tin tức tiếng Anh cập nhật với bản dịch song ngữ. Mở rộng vốn từ vựng và cải thiện kỹ năng đọc hiểu thông qua các bài báo thực tế.',
  keywords: [
    'tin tức tiếng anh',
    'bản dịch song ngữ',
    'đọc tin tức',
    'từ vựng tiếng anh',
    'bài báo tiếng anh',
  ],
  openGraph: {
    title: 'Tin tức tiếng Anh | News',
    description:
      'Đọc tin tức tiếng Anh cập nhật với bản dịch song ngữ. Mở rộng vốn từ vựng và cải thiện kỹ năng đọc hiểu thông qua các bài báo thực tế.',
    type: 'website',
  },
};

const Page = () => {
  return <NewsPage />;
};

export default Page;
