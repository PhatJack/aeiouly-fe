import React from 'react';

import { Metadata } from 'next';

import ReadingPage from './_components/ReadingPage';

export const metadata: Metadata = {
  title: 'Đọc hiểu tiếng Anh | Reading - Aeiouly',
  description:
    'Luyện đọc hiểu tiếng Anh với các bài đọc đa dạng, từ vựng phong phú và bài tập tương tác. Phát triển kỹ năng đọc và mở rộng vốn từ vựng.',
  keywords: [
    'đọc hiểu tiếng anh',
    'luyện đọc tiếng anh',
    'bài đọc tiếng anh',
    'từ vựng tiếng anh',
    'kỹ năng đọc',
  ],
  openGraph: {
    title: 'Đọc hiểu tiếng Anh | Reading - Aeiouly',
    description:
      'Luyện đọc hiểu tiếng Anh với các bài đọc đa dạng, từ vựng phong phú và bài tập tương tác. Phát triển kỹ năng đọc và mở rộng vốn từ vựng.',
    type: 'website',
  },
};

const Page = () => {
  return <ReadingPage />;
};

export default Page;
