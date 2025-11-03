import { Metadata } from 'next';

import SoloPage from './_components/SoloPage';

export const metadata: Metadata = {
  title: 'Solo',
};

export default function Solo() {
  return <SoloPage />;
}
