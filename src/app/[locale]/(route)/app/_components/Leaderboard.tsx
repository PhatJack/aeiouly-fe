'use client';

import React from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import AvatarCustom from '@/components/custom/AvatarCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetOnlineStreakLeaderboardQuery } from '@/services/online/get-leaderboard-online-streak.api';

import { Flame, TrendingUp, Trophy } from 'lucide-react';

const Leaderboard = () => {
  const { data, isLoading, error } = useGetOnlineStreakLeaderboardQuery();
  const t = useTranslations('Leaderboard');

  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return 'default';
    if (streak >= 20) return 'success';
    if (streak >= 10) return 'warning';
    if (streak >= 5) return 'info';
    if (streak >= 1) return 'destructive';
    return 'outline';
  };

  if (isLoading) {
    return <LoadingWithText text={t('loading')} />;
  }

  if (error) {
    return <EmptyCustom title={t('error')} description={t('errorDescription')} />;
  }

  return (
    <Card className="hidden min-w-sm md:flex md:max-h-[calc(100dvh-5.75rem)] md:flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-6 pb-6">
          {data && data.leaderboard.length > 0 ? (
            <>
              {data.leaderboard.map((item, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={item.user.id}
                    className={`mb-3 flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${
                      rank === 1
                        ? 'bg-gradient-to-r from-amber-300/70 to-transparent dark:from-amber-300/20'
                        : rank === 2
                          ? 'bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-200/20'
                          : rank === 3
                            ? 'bg-gradient-to-r from-yellow-700/70 to-transparent dark:from-yellow-700/20'
                            : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex size-12 items-center justify-center text-lg font-bold">
                      <Image
                        src={`/leaderboard/rank${index + 1}.png`}
                        alt={`Rank ${rank}`}
                        width={48}
                        height={48}
                        sizes="100vw"
                      />
                    </div>

                    {/* Avatar */}
                    <AvatarCustom
                      className="size-12"
                      url={item.user.avatar_url}
                      fallback={item.user.username?.charAt(0).toUpperCase()}
                    />

                    {/* User Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {item.user.full_name || item.user.username}
                      </p>
                      <p className="text-muted-foreground truncate text-sm">
                        @{item.user.username}
                      </p>
                    </div>

                    {/* Streak Info */}
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={getStreakBadgeVariant(item.current_streak)} className="gap-1">
                        <Flame className="h-3 w-3" />
                        {item.current_streak} {t('days')}
                      </Badge>
                      {/* {item.longest_streak > item.current_streak && ( */}
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        <span>
                          {t('highest')} {item.longest_streak}
                        </span>
                      </div>
                      {/* )} */}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-muted-foreground py-8 text-center">{t('noData')}</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
