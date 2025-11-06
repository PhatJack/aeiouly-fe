import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';
import Providers from './providers';

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
    url: 'https://aeiouly.site',
    siteName: 'Aeiouly',
    images: [
      {
        url: '/meta-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aeiouly',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s - Aeiouly',
      default: 'Home',
    },
    description:
      'Lộ trình chinh phục tiếng Anh cùng Aeiouly sẽ vừa thú vị vừa hiệu quả. Công cụ, bài học và phương pháp cá nhân hóa của chúng tôi giúp bạn tự tin giao tiếp tiếng Anh.',
    images: [
      {
        url: '/meta-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Aeiouly',
      },
    ],
  },
  verification: {
    google: 'cZNWDNvfb1eBjhJBoIU77GPztU1w-j5v5IjaUca_3Z8',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${beVietNamPro.variable} ${geistSans.variable} flex antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
