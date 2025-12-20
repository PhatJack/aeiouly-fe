'use client';

import React, { useMemo } from 'react';

import { Bagel_Fat_One } from 'next/font/google';
import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import WeekdayProgress from '@/components/shared/streak/WeekdayProgress';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/contexts/AuthContext';
import { cn, getFireProps, streakToText } from '@/lib/utils';
import { useGetWeeklyStreakStatusQuery } from '@/services/online';

import { Check } from 'lucide-react';

const bagelFastOne = Bagel_Fat_One({
  variable: '--font-bagel-fat-one',
  subsets: ['latin'],
  weight: ['400'],
});

const StreakSection = () => {
  const user = useAuthStore((state) => state.user);

  const stats = {
    days: 22,
    lessons: 36,
    quizzes: 18,
    minutes: 231,
  };

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

  if (isLoadingStreakHistory) {
    return <LoadingWithText text="Đang tải thành tích chuỗi..." />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Streak Display Card */}
      <Card className="shadow-none dark:bg-transparent">
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
              {streakToText(streakHistory?.current_streak ?? 0)}
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {streakHistory?.today_has_streak
                ? `Bạn đã thắp sáng chuỗi hôm nay, ${user?.full_name}! 😍`
                : `${user?.full_name} ơi, bạn chưa thắp sáng chuỗi hôm nay đấy! 😥`}
            </p>
          </div>

          {/* Week Days Progress */}
          <WeekdayProgress completedDays={completedDays || []} dayNumbers={dayNumbers || []} />
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-background gap-0 px-1 py-1 shadow-none dark:bg-transparent">
        <CardHeader>
          <div className="mx-auto rounded-full px-4 py-1">
            <Label className="text-muted-foreground text-sm font-medium">
              Thống kê chuỗi và thời gian
            </Label>
          </div>
        </CardHeader>
        <CardContent className="dark:bg-background space-y-4 rounded-lg bg-white px-2 py-4">
          {/* Stats Grid */}
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
      </Card>
    </div>
  );
};

export default StreakSection;
