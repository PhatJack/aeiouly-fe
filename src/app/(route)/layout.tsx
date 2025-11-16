'use client';

import { usePathname } from 'next/navigation';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import { ROUTE } from '@/configs/route';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const location = usePathname();

  return (
    <>
      <Sidebar />
      <main
        className={cn('relative size-full min-h-screen rounded-l-3xl bg-white dark:bg-[#121212]')}
      >
        {location !== ROUTE.SPACE && <Header />}
        <div className={'p-4'}>{children}</div>
      </main>
    </>
  );
}
