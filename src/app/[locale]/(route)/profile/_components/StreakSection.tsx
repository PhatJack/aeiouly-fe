'use client';

import React, { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { Bagel_Fat_One } from 'next/font/google';
import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import WeekdayProgress from '@/components/shared/streak/WeekdayProgress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/contexts/AuthContext';
import { cn, getFireProps } from '@/lib/utils';
import { useGetWeeklyStreakStatusQuery } from '@/services/online';

import { Check } from 'lucide-react';

const bagelFastOne = Bagel_Fat_One({
  variable: '--font-bagel-fat-one',
  subsets: ['latin'],
  weight: ['400'],
});

// Streak level thresholds in days
const STREAK_DAILY_THRESHOLD = 7;
const STREAK_WEEKLY_THRESHOLD = 30;
const STREAK_MONTHLY_THRESHOLD = 365;

const StreakSection = () => {
  const user = useAuthStore((state) => state.user);
  const t = useTranslations('profile');

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

  const { size, imgClass } = useMemo(
    () =>
      getFireProps(streakHistory?.current_streak ?? 0, streakHistory?.today_has_streak || false),
    [streakHistory?.current_streak, streakHistory?.today_has_streak]
  );

  const getStreakLevelKey = (streak: number): string => {
    if (streak <= STREAK_DAILY_THRESHOLD) return 'streak.levels.daily';
    if (streak <= STREAK_WEEKLY_THRESHOLD) return 'streak.levels.weekly';
    if (streak <= STREAK_MONTHLY_THRESHOLD) return 'streak.levels.monthly';
    return 'streak.levels.yearly';
  };

  if (isLoadingStreakHistory) {
    return <LoadingWithText text={t('streak.loading')} />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Streak Display Card */}
      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <div className="relative mb-5">
            {/* Original Fire Icon Container */}
            <div className="bg-background flex size-28 items-center justify-center rounded-full border">
              <Image
                src={'/streak/fire_active.gif'}
                alt="fire streak"
                width={size}
                height={size}
                className={imgClass}
                unoptimized
              />
            </div>
            <div className="absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full">
              <span className={cn('text-6xl font-bold', bagelFastOne.className)}>
                {streakHistory?.current_streak}
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="mt-2 text-center">
            <h2 className="text-xl font-bold">
              {t(getStreakLevelKey(streakHistory?.current_streak ?? 0))}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {streakHistory?.today_has_streak
                ? t('streak.todayLit', { name: user?.full_name ?? '' })
                : t('streak.todayNotLit', { name: user?.full_name ?? '' })}
            </p>
          </div>

          {/* Week Days Progress */}
          <WeekdayProgress completedDays={completedDays || []} dayNumbers={dayNumbers || []} />
        </CardContent>
      </Card>

      {/* Stats Card */}
      {/* <Card className="bg-background gap-0 px-1 py-1 shadow-none dark:bg-transparent">
        <CardHeader>
          <div className="mx-auto rounded-full px-4 py-1">
            <Label className="text-muted-foreground text-sm font-medium">
              Thống kê chuỗi và thời gian
            </Label>
          </div>
        </CardHeader>
        <CardContent className="dark:bg-background space-y-4 rounded-lg bg-white px-2 py-4">
          <div className="grid grid-cols-4 divide-x">
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Ngày</span>
              <span className="text-2xl font-bold">{stats.days}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Bài học</span>
              <span className="text-2xl font-bold">{stats.lessons}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Bài kiểm tra</span>
              <span className="text-2xl font-bold">{stats.quizzes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Phút</span>
              <span className="text-2xl font-bold">{stats.minutes}</span>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default StreakSection;
