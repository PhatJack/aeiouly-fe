'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import AIChatBox from '@/components/shared/chat/AIChatBox';
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

  const shouldHide = useMemo(() => {
    return (
      /^\/writing\/\d+$/.test(location) ||
      /^\/reading\/\d+$/.test(location) ||
      /^\/speaking\/\d+$/.test(location) ||
      /^\/listening\/\d+$/.test(location) ||
      /^\/admin(\/.*)?$/.test(location)
    );
  }, [location]);

  return (
    <div className="flex size-full">
      <Sidebar isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
      <main
        id="main-layout"
        className={cn(
          'bg-card relative min-h-screen w-full flex-1 transition-[margin] lg:border-l',
          isExpanded ? 'lg:ml-60' : 'lg:ml-[72px]',
          shouldHide && 'lg:ml-0'
        )}
      >
        {location !== ROUTE.SPACE && (
          <Header isExpanded={isExpanded} handleToggleExpand={handleToggleExpand} />
        )}
        <div id="content-wrapper" className={'w-full overflow-x-hidden overflow-y-auto p-4'}>
          {children}
        </div>
      </main>
      <AIChatBox />
      {/* <ScrollToTop /> */}
    </div>
  );
}
