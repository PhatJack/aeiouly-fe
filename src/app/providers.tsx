'use client';

import React from 'react';

import { usePathname } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';

import GlobalQueryLoading from '@/components/GlobalLoading';
import Sidebar from '@/components/shared/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ROUTE } from '@/configs/route';
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { QueryClientProvider } from '@tanstack/react-query';

import { getQueryClient } from './get-query-client';

const queryClient = getQueryClient();
const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const location = usePathname();
  const excludedPaths = Object.values(ROUTE.AUTH);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextTopLoader color="hsl(150 30% 45%)" zIndex={9999} />
        <TooltipProvider>
          <AuthProvider>
            {!excludedPaths.includes(location) ? <Sidebar /> : null}
            <main
              className={cn(
                'size-full min-h-screen bg-white',
                !excludedPaths.includes(location) ? 'rounded-l-3xl border px-6 py-5' : ''
              )}
            >
              {children}
            </main>
          </AuthProvider>
        </TooltipProvider>
        <Toaster position="top-right" toastOptions={{}} theme={'light'} richColors />
        <GlobalQueryLoading />
      </QueryClientProvider>
    </>
  );
};

export default Providers;
