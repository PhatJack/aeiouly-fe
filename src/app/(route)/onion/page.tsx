import { Metadata } from 'next';

import OnionPage from './_components/OnionPage';

export const metadata: Metadata = {
  title: 'Luyện nói tiếng Anh | Speaking - Aeiouly',
  description:
    'Luyện nói tiếng Anh với AI chat bot thông minh. Thực hành giao tiếp tiếng Anh hàng ngày với phản hồi tức thời và bài tập cá nhân hóa.',
  keywords: [
    'luyện nói tiếng anh',
    'nói tiếng anh',
    'AI chat bot',
    'giao tiếp tiếng anh',
    'thực hành nói',
  ],
  openGraph: {
    title: 'Luyện nói tiếng Anh | Speaking - Aeiouly',
    description:
      'Luyện nói tiếng Anh với AI chat bot thông minh. Thực hành giao tiếp tiếng Anh hàng ngày với phản hồi tức thời và bài tập cá nhân hóa.',
    type: 'website',
  },
};

const Page = () => {
  return <OnionPage />;
};

export default Page;
