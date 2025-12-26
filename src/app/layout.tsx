import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Geist } from 'next/font/google';

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';

import './globals.css';
import Providers from './providers';

// import './theme-toggle.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const beVietNamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: '%s - Aeiouly',
    default: 'Home',
  },
  keywords: ['tiếng anh', 'học tiếng anh', 'tiếng anh giao tiếp', 'AI tiếng anh'],
  robots: {
    index: true,
    follow: true,
  },
  description:
    'Lộ trình chinh phục tiếng Anh cùng Aeiouly sẽ vừa thú vị vừa hiệu quả. Công cụ, bài học và phương pháp cá nhân hóa của chúng tôi giúp bạn tự tin giao tiếp tiếng Anh.',
  openGraph: {
    title: {
      template: '%s - Aeiouly',
      default: 'Trang chủ',
    },
    description:
      'Lộ trình chinh phục tiếng Anh cùng Aeiouly sẽ vừa thú vị vừa hiệu quả. Công cụ, bài học và phương pháp cá nhân hóa của chúng tôi giúp bạn tự tin giao tiếp tiếng Anh.',
    url: 'https://aeiouly.online',
    siteName: 'Aeiouly',
    images: [
      {
        url: 'https://aeiouly.online/banner-auth.webp',
        width: 1200,
        height: 630,
        alt: 'Aeiouly Social Banner',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s - Aeiouly',
      default: 'Trang chủ',
    },
    description:
      'Lộ trình chinh phục tiếng Anh cùng Aeiouly sẽ vừa thú vị vừa hiệu quả. Công cụ, bài học và phương pháp cá nhân hóa của chúng tôi giúp bạn tự tin giao tiếp tiếng Anh.',
    images: [
      {
        url: 'https://aeiouly.online/banner-auth.webp',
        width: 1200,
        height: 630,
        alt: 'Aeiouly Social Banner',
      },
    ],
  },
  verification: {
    google: 'UQXZPYf8olCx-BLqPMIZKz_ofNDD6vRWB9qGTjIwr2I',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning data-overlayscrollbars-initialize>
      <body className={`${beVietNamPro.variable} ${geistSans.variable} flex antialiased`}>
        <Providers>{children}</Providers>
      </body>
      <Analytics />
      <GoogleAnalytics gaId="G-J5TMBGYNY4" />
      <GoogleTagManager gtmId="GTM-MQ65G5KB" />
    </html>
  );
}
