'use client';

import React from 'react';

// import QuoteDisplay from "./quote-display";
import { usePomodoroTimer } from '@/hooks/use-pomodoro-timer';

import { Archive, Home, Settings, User2 } from 'lucide-react';

import BackgroundIframe from './BackgroundIframe';
import StickyContainer from './sticky-container';
import StickyMenu from './sticky-menu';

const SoloPage = () => {
  // Initialize the Pomodoro timer
  usePomodoroTimer();

  const items = [
    { icon: <Home size={18} />, label: 'Home', onClick: () => alert('Home!') },
    { icon: <Archive size={18} />, label: 'Archive', onClick: () => alert('Archive!') },
    { icon: <User2 size={18} />, label: 'Profile', onClick: () => alert('Profile!') },
    { icon: <Settings size={18} />, label: 'Settings', onClick: () => alert('Settings!') },
  ];

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
          {/* <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} /> */}
        </div>
      </div>
    </div>
  );
};

export default SoloPage;
