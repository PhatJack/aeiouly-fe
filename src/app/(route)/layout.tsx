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
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main
        className={cn(
          'relative min-h-screen w-full flex-1 overflow-auto rounded-l-3xl bg-white dark:bg-[#121212]'
        )}
      >
        {location !== ROUTE.SPACE && <Header />}
        <div className={'p-4'}>{children}</div>
      </main>
    </div>
  );
}
