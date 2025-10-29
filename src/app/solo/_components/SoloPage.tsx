'use client';

import React from 'react';

// import QuoteDisplay from "./quote-display";
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

import BackgroundIframe from './BackgroundIframe';
import StickyContainer from './sticky-container';
import StickyMenu from './sticky-menu';

const SoloPage = () => {
  // Initialize the Pomodoro timer
  usePomodoroTimer();

  return (
    <div className="h-full">
      <BackgroundIframe />
      <div className="relative z-10">
        <div className="relative mb-6 flex size-full h-12 items-center justify-between">
          <StickyMenu />
        </div>
        <div className="sticky top-0 h-[calc(100vh-3rem-1rem-2.5rem-0.5rem)] overflow-hidden rounded-md">
          <StickyContainer />
          {/* <QuoteDisplay /> */}
        </div>
      </div>
    </div>
  );
};

export default SoloPage;
