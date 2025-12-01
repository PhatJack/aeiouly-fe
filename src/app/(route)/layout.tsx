'use client';

import React, { useCallback, useState } from 'react';

import { usePathname } from 'next/navigation';

import Header from '@/components/shared/Header';
import ScrollToTop from '@/components/shared/ScrollToTop';
import Sidebar from '@/components/shared/Sidebar';
import { ROUTE } from '@/configs/route';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);
  const location = usePathname();

  return (
    <div className="flex size-full overflow-y-auto">
      <Sidebar isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
      <main
        className={cn(
          'relative min-h-screen w-full flex-1 overflow-x-hidden bg-white transition-[margin] lg:border-l dark:bg-[#121212]',
          isExpanded ? 'lg:ml-60' : 'lg:ml-[72px]'
        )}
      >
        {location !== ROUTE.SPACE && (
          <Header isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
        )}
        <div className={'w-full overflow-hidden p-4'}>{children}</div>
      </main>
      <ScrollToTop />
    </div>
  );
}
