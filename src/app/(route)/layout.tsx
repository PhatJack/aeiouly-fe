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
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar isExpanded={isExpanded} />
      <main
        className={cn(
          'relative min-h-screen w-full flex-1 overflow-auto rounded-l-3xl bg-white dark:bg-[#121212]'
        )}
      >
        {location !== ROUTE.SPACE && (
          <Header isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
        )}
        <div className={'p-4'}>{children}</div>
      </main>
    </div>
  );
}
