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

  const completedDays = useMemo(
    () => streakHistory?.days?.map((d) => d.has_streak),
    [streakHistory]
  );
  const dayNumbers = useMemo(
    () => streakHistory?.days?.map((d) => new Date(d.date).getDate()),
    [streakHistory]
  );

  if (isLoadingStreakHistory) {
    return <Skeleton className="h-10 w-16 rounded-full" />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2 rounded-full border border-y pr-2">
          {/* Original Fire Icon Container */}
          <div className="bg-muted relative flex size-10 items-center justify-center rounded-full">
            <Image
              src={'/streak/fire_active.gif'}
              alt="Streak icon"
              className={cn('size-8', streakHistory?.today_has_streak ? '' : 'grayscale')}
              width={40}
              height={40}
              unoptimized
            />
          </div>
          <span
            className={cn(
              'text-xl font-bold',
              streakHistory?.today_has_streak ? 'text-primary' : 'text-gray-500'
            )}
          >
            {streakHistory?.current_streak || 0}
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="space-y-2">
          <div className="text-center">
            <p className="text-sm font-medium">Chuỗi học tập</p>
            <p className="text-muted-foreground">
              {streakHistory?.current_streak || 0} ngày liên tiếp
            </p>
          </div>
          <WeekdayProgress completedDays={completedDays || []} dayNumbers={dayNumbers || []} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HeaderShortcutStreak;
