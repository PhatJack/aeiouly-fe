import { Metadata } from 'next';

import OnionPage from './_components/OnionPage';

export const metadata: Metadata = {
  title: 'Luyện nói',
  description: 'Luyện nói tiếng Anh',
};

const Page = () => {
  return <OnionPage />;
};

export default Page;
