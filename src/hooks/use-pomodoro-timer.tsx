'use client';

import { useEffect, useRef } from 'react';

import { usePomodoroStore } from './use-pomodoro-store';

/**
 * Hook to handle Pomodoro timer ticking
 * This should be used once at the root of the solo page
 */
export const usePomodoroTimer = () => {
  const { isRunning, isPaused, tick } = usePomodoroStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      // Start the interval
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      // Clear the interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, tick]);
};
