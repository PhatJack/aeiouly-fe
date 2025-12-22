'use client';

import React, { useEffect } from 'react';

import { useTheme } from 'next-themes';

import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

import BackgroundIframe from './BackgroundIframe';
import StickyContainer from './sticky-container';
import StickyMenu from './sticky-menu';

const SoloPage = () => {
  const { setTheme } = useTheme();
  // Initialize the Pomodoro timer
  usePomodoroTimer();

  useEffect(() => {
    setTheme('dark');
    return () => {
      setTheme('light');
    };
  }, [setTheme]);

  return (
    <div className="h-full">
      <BackgroundIframe />
      <div className="relative z-10">
        <div className="relative mb-4 flex size-full h-12 items-center justify-between">
          <StickyMenu />
        </div>
        <div className="sticky top-0 h-[calc(100vh-3rem-1rem-2.5rem-0.5rem)] overflow-hidden rounded-md">
          <StickyContainer />
        </div>
      </div>
    </div>
  );
};

export default SoloPage;
