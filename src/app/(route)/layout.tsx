'use client';

import React, { useCallback, useState } from 'react';

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
          'relative min-h-screen w-full flex-1 rounded-l-3xl bg-white transition-[margin] dark:bg-[#121212]',
          isExpanded ? 'lg:ml-60' : 'lg:ml-20'
        )}
      >
        {location !== ROUTE.SPACE && (
          <Header isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
        )}
        <div className={'w-full overflow-hidden p-4'}>{children}</div>
      </main>
    </div>
  );
}
