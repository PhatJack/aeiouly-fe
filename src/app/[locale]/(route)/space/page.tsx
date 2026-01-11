import { Metadata } from 'next';

import SoloPage from './_components/SoloPage';

export const metadata: Metadata = {
  title: 'Không gian tự học',
  description:
    'Môi trường học tập tập trung với nhạc nền, video nền và công cụ Pomodoro. Tối ưu hóa hiệu quả học tiếng Anh với không gian làm việc cá nhân hóa.',
  keywords: [
    'học tập tập trung',
    'solo study',
    'pomodoro',
    'nhạc nền học tập',
    'video nền',
    'hiệu quả học',
  ],
  openGraph: {
    title: 'Không gian tự học',
    description:
      'Môi trường học tập tập trung với nhạc nền, video nền và công cụ Pomodoro. Tối ưu hóa hiệu quả học tiếng Anh với không gian làm việc cá nhân hóa.',
    type: 'website',
  },
};

export default function Solo() {
  return <SoloPage />;
}
