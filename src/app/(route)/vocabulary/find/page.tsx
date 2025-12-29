import React from 'react';

import { Metadata } from 'next';

import FindVocabularyPage from './FindVocabularyPage';

export const metadata: Metadata = {
  title: 'Tra từ điển Anh-Việt | Aeiouly',
  description:
    'Tra cứu từ vựng tiếng Anh với định nghĩa tiếng Việt chi tiết. Tìm kiếm nhanh chóng trong từ điển Anh-Việt với hàng nghìn từ vựng phong phú.',
  keywords: [
    'tra từ điển',
    'từ điển anh việt',
    'tra cứu từ vựng',
    'tìm kiếm từ vựng',
    'english vietnamese dictionary',
    'dictionary',
  ],
  openGraph: {
    title: 'Tra từ điển Anh-Việt | Aeiouly',
    description:
      'Tra cứu từ vựng tiếng Anh với định nghĩa tiếng Việt chi tiết. Tìm kiếm nhanh chóng trong từ điển Anh-Việt.',
    type: 'website',
  },
};

const Page = () => {
  return <FindVocabularyPage />;
};

export default Page;
