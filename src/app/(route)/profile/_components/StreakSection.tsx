'use client';

import React from 'react';

import { Bagel_Fat_One } from 'next/font/google';
import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/contexts/AuthContext';
import { cn, getFireProps, streakToText } from '@/lib/utils';
import { useGetStreakHistoryQuery } from '@/services/analytics';

import { Check } from 'lucide-react';

const bagelFastOne = Bagel_Fat_One({
  variable: '--font-bagel-fat-one',
  subsets: ['latin'],
  weight: ['400'],
});

const StreakSection = () => {
  // Mock data - replace with actual data from API
  const user = useAuthStore((state) => state.user);
  const currentStreak = 4;
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const stats = {
    days: 22,
    lessons: 36,
    quizzes: 18,
    minutes: 231,
  };
  const { data: streakHistory, isLoading: isLoadingStreakHistory } = useGetStreakHistoryQuery(7);

  const completedDays = streakHistory?.streak_history?.map((d) => d.logged_in);
  const dayNumbers = streakHistory?.streak_history?.map((d) => new Date(d.date).getDate());

  const { size, imgClass } = getFireProps(currentStreak, true);

  if (isLoadingStreakHistory) {
    return <LoadingWithText text="Đang tải thành tích chuỗi..." />;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Streak Display Card */}
      <Card className="shadow-none dark:bg-transparent">
        <CardContent className="flex flex-col items-center justify-center gap-4">
          {/* Fire Icon with Streak Number */}
          <div className="relative mb-5">
            <div className="bg-background flex size-28 items-center justify-center rounded-full border">
              <Image
                src={'/streak/fire_active.gif'}
                quality={100}
                alt="fire streak"
                width={size}
                height={size}
                className={imgClass}
              />
            </div>
            <div className="absolute -bottom-9 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full">
              <span className={cn('text-6xl font-bold', bagelFastOne.className)}>
                {streakHistory?.summary.current_streak}
              </span>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">{streakToText(currentStreak)}</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              You are doing really great, {user?.full_name}!
            </p>
          </div>

          {/* Week Days Progress */}
          <div className="flex gap-2">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">{day}</span>
                {completedDays?.[index] ? (
                  <div className="from-primary/20 via-primary/70 to-primary flex size-9 items-center justify-center rounded-full bg-gradient-to-br backdrop-blur-sm">
                    <Check className="text-primary-foreground h-5 w-5" />
                  </div>
                ) : (
                  <div className="text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                    {dayNumbers?.[index]}
                  </div>
                )}
              </div>
            ))}
          </div>
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
        <CardContent className="dark:bg-background space-y-4 rounded-lg bg-white py-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 divide-x">
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Days</span>
              <span className="text-2xl font-bold">{stats.days}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Lessons</span>
              <span className="text-2xl font-bold">{stats.lessons}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Quizzes</span>
              <span className="text-2xl font-bold">{stats.quizzes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-muted-foreground text-xs font-semibold">Minutes</span>
              <span className="text-2xl font-bold">{stats.minutes}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakSection;
