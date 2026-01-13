'use client';

import React, { useEffect } from 'react';

import { useTheme } from 'next-themes';
import NextTopLoader from 'nextjs-toploader';

import GlobalQueryLoading from '@/components/GlobalLoading';
import NavigationBlocker from '@/components/NavigationBlocker';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpeakingSessionProvider } from '@/contexts/SpeakingSessionContext';
import { SpeechProvider } from '@/contexts/SpeechContext';
import { ThemeCustomProvider } from '@/contexts/ThemeCustomContext';
import { WebSocketProvider } from '@/contexts/WebsocketContext';
import { WritingSessionProvider } from '@/contexts/WritingSessionContext';
import { SoloSoundProvider } from '@/hooks/use-solo-sound-store';
import { QueryClientProvider } from '@tanstack/react-query';

import { ToasterProps } from 'sonner';

import { getQueryClient } from './get-query-client';

const queryClient = getQueryClient();

const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const theme = localStorage.getItem('aeiouly-theme');
    if (!theme) {
      setTheme('light');
    }
  }, [setTheme]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeCustomProvider>
        <QueryClientProvider client={queryClient}>
          <NextTopLoader color="hsl(150 30% 45%)" zIndex={9999} showSpinner={false} />
          <TooltipProvider>
            <AuthProvider>
              <WebSocketProvider>
                <WritingSessionProvider>
                  <SpeakingSessionProvider>
                    <SpeechProvider>
                      <SoloSoundProvider>{children}</SoloSoundProvider>
                    </SpeechProvider>
                  </SpeakingSessionProvider>
                </WritingSessionProvider>
              </WebSocketProvider>
            </AuthProvider>
          </TooltipProvider>
          <Toaster
            position="top-center"
            toastOptions={{}}
            theme={resolvedTheme as ToasterProps['theme']}
            richColors
          />
          <NavigationBlocker />
          <GlobalQueryLoading />
        </QueryClientProvider>
      </ThemeCustomProvider>
    </ThemeProvider>
  );
};

export default Providers;
