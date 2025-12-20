'use client';

import React from 'react';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';
import { useSoloStore } from '@/hooks/use-solo-store';

const SoundListDynamic = dynamic(() => import('./sound-list'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-72" />,
});
const SessionGoalDynamic = dynamic(() => import('./session-goal'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-72" />,
});
const StudyStatDynamic = dynamic(() => import('./study-stat'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-72" />,
});
const BackgroundListDynamic = dynamic(() => import('./background-list'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-72" />,
});
const PomodoroDynamic = dynamic(() => import('./pomodoro'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-72" />,
});

const StickyContainer = () => {
  const { isOpenPomodoro, isOpenSessionGoal, activePanel } = useSoloStore();

  return (
    <>
      {/* Left Panels */}
      <div className="fixed top-0 right-0 left-0 flex w-full flex-col gap-6 p-4 md:absolute md:right-auto md:left-0 md:w-72 md:p-0">
        {isOpenPomodoro ? <PomodoroDynamic /> : null}
        {isOpenSessionGoal ? <SessionGoalDynamic /> : null}
      </div>

      {/* Right Panels */}
      <div className="fixed top-0 right-0 left-0 flex w-full justify-end p-4 md:absolute md:right-0 md:left-auto md:w-72 md:p-0">
        {/* {activePanel === "quote" ? <QuoteDynamic /> : null} */}
        {activePanel === 'sound' ? <SoundListDynamic /> : null}
        {activePanel === 'studyStats' ? <StudyStatDynamic /> : null}
        {activePanel === 'backgroundIframe' ? <BackgroundListDynamic /> : null}
      </div>
    </>
  );
};

export default React.memo(StickyContainer);
