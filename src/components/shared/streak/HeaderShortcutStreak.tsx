'use client';

import React, { useMemo } from 'react';

import Image from 'next/image';

import { Popover, PopoverContent } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetWeeklyStreakStatusQuery } from '@/services/analytics';
import { PopoverTrigger } from '@radix-ui/react-popover';

import WeekdayProgress from './WeekdayProgress';

const HeaderShortcutStreak = () => {
  const { data: streakHistory, isLoading: isLoadingStreakHistory } =
    useGetWeeklyStreakStatusQuery();

  const isLoggedToday = useMemo(() => {
    if (!streakHistory || streakHistory.length === 0) return false;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return streakHistory.some((entry) => entry.date === todayStr && entry.logged_in);
  }, [streakHistory]);
  const completedDays = useMemo(() => streakHistory?.map((d) => d.logged_in), [streakHistory]);
  const dayNumbers = useMemo(
    () => streakHistory?.map((d) => new Date(d.date).getDate()),
    [streakHistory]
  );

  if (isLoadingStreakHistory) {
    return <Skeleton className="size-10 rounded-full" />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="rounded-full p-1">
          <div className="relative flex size-10 cursor-pointer place-content-center rounded-full border p-1">
            <Image
              src={'/streak/fire_active.gif'}
              alt="Streak icon"
              className={cn('size-8', isLoggedToday ? '' : 'grayscale')}
              width={40}
              height={40}
              unoptimized
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <WeekdayProgress completedDays={completedDays || []} dayNumbers={dayNumbers || []} />
      </PopoverContent>
    </Popover>
  );
};

export default HeaderShortcutStreak;
