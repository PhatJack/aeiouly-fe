'use client';

import React, { useEffect, useRef } from 'react';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import GlobalQueryLoading from '@/components/GlobalLoading';
import NavigationBlocker from '@/components/NavigationBlocker';
import Sidebar from '@/components/shared/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROUTE } from '@/configs/route';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeechProvider } from '@/contexts/SpeechContext';
import { WritingSessionProvider } from '@/contexts/WritingSessionContext';
import { SoloSoundProvider } from '@/hooks/use-solo-sound-store';
import { cn } from '@/lib/utils';
import { QueryClientProvider } from '@tanstack/react-query';

import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';

import { getQueryClient } from './get-query-client';

const queryClient = getQueryClient();
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setTheme } = useTheme();
  const location = usePathname();
  const excludedPaths = [...Object.values(ROUTE.AUTH)];
  useEffect(() => {
    const theme = localStorage.getItem('aeiouly-theme');
    if (!theme) {
      setTheme('light');
    }
    if (typeof window !== 'undefined') {
      OverlayScrollbars(window.document.body, {
        scrollbars: {
          theme: 'scrollbar-base scrollbar-auto py-1',
          autoHide: 'move',
          autoHideDelay: 500,
          autoHideSuspend: false,
        },
      });
    }
  }, [setTheme]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader color="hsl(150 30% 45%)" zIndex={9999} showSpinner={false} />
        <TooltipProvider>
          <AuthProvider>
            <WritingSessionProvider>
              <SpeechProvider>
                <SoloSoundProvider>
                  {!excludedPaths.includes(location) ? <Sidebar /> : null}
                  <main
                    className={cn(
                      'relative size-full min-h-screen bg-white',
                      !excludedPaths.includes(location) ? 'rounded-l-3xl px-6 py-5' : ''
                    )}
                  >
                    {children}
                  </main>
                </SoloSoundProvider>
              </SpeechProvider>
            </WritingSessionProvider>
          </AuthProvider>
        </TooltipProvider>
        <Toaster position="top-center" toastOptions={{}} theme={'light'} richColors />
        <NavigationBlocker />
        <GlobalQueryLoading />
      </QueryClientProvider>
    </>
  );
};

export default Providers;
