'use client';

import React from 'react';

import { useTranslations } from 'next-intl';

import LoadingWithText from '@/components/LoadingWithText';
import AvatarCustom from '@/components/custom/AvatarCustom';
import EmptyCustom from '@/components/custom/EmptyCustom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetOnlineStreakLeaderboardQuery } from '@/services/online/get-leaderboard-online-streak.api';

import { Crown, Flame, TrendingUp, Trophy } from 'lucide-react';

const LeaderboardPage = () => {
  const { data, isLoading, error } = useGetOnlineStreakLeaderboardQuery();
  const t = useTranslations('leaderboard');

  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return 'default';
    if (streak >= 20) return 'success';
    if (streak >= 10) return 'warning';
    if (streak >= 5) return 'info';
    if (streak >= 1) return 'destructive';
    return 'outline';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return t('onFire');
    if (streak >= 20) return t('keepItUp');
    if (streak >= 10) return t('greatStreak');
    if (streak >= 5) return t('goodStart');
    return '';
  };

  if (isLoading) {
    return <LoadingWithText text={t('loading')} />;
  }

  if (error) {
    return <EmptyCustom title={t('error')} description={t('errorDescription')} />;
  }

  const topThree = data?.leaderboard.slice(0, 3) || [];
  const others = data?.leaderboard.slice(3) || [];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          </div>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        {data && data.leaderboard.length > 0 ? (
          <div className="space-y-4">
            {/* Podium - Top 3 */}
            <div className="space-y-4">
              <h2 className="text-center text-lg font-semibold">{t('topPerformer')}</h2>
              <div className="flex items-end justify-center gap-4">
                {/* Second Place */}
                {topThree[1] && (
                  <div className="flex w-28 flex-col items-center sm:w-48 lg:w-60">
                    <AvatarCustom
                      className="mb-2 size-16 border-4 border-gray-400"
                      url={topThree[1].user.avatar_url}
                      fallback={topThree[1].user.username?.charAt(0).toUpperCase()}
                    />
                    <p className="mb-1 truncate text-center text-sm font-semibold">
                      {topThree[1].user.full_name || topThree[1].user.username}
                    </p>
                    <Badge
                      variant={getStreakBadgeVariant(topThree[1].current_streak)}
                      className="mb-3"
                    >
                      <Flame className="mr-1 h-3 w-3" />
                      {topThree[1].current_streak} {t('days')}
                    </Badge>
                    <div className="flex h-32 w-full flex-col items-center justify-center rounded-t-lg border-2 border-gray-500 bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500">
                      <span className="text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
                        2
                      </span>
                    </div>
                  </div>
                )}

                {/* First Place */}
                {topThree[0] && (
                  <div className="flex w-28 flex-col items-center sm:w-48 lg:w-60">
                    <Crown className="mb-2 h-6 w-6 text-yellow-500" />
                    <AvatarCustom
                      className="mb-2 size-20 border-4 border-yellow-500"
                      url={topThree[0].user.avatar_url}
                      fallback={topThree[0].user.username?.charAt(0).toUpperCase()}
                    />
                    <p className="mb-1 truncate text-center text-sm font-bold">
                      {topThree[0].user.full_name || topThree[0].user.username}
                    </p>
                    <Badge className="mb-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <Flame className="mr-1 h-3 w-3" />
                      {topThree[0].current_streak} {t('days')}
                    </Badge>
                    <div className="flex h-48 w-full flex-col items-center justify-center rounded-t-lg border-4 border-yellow-500 bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600">
                      <span className="text-4xl font-bold text-white sm:text-6xl lg:text-8xl">
                        1
                      </span>
                    </div>
                  </div>
                )}

                {/* Third Place */}
                {topThree[2] && (
                  <div className="flex w-28 flex-col items-center sm:w-48 lg:w-60">
                    <AvatarCustom
                      className="mb-2 size-16 border-4 border-amber-700"
                      url={topThree[2].user.avatar_url}
                      fallback={topThree[2].user.username?.charAt(0).toUpperCase()}
                    />
                    <p className="mb-1 truncate text-center text-sm font-semibold">
                      {topThree[2].user.full_name || topThree[2].user.username}
                    </p>
                    <Badge
                      variant={getStreakBadgeVariant(topThree[2].current_streak)}
                      className="mb-3"
                    >
                      <Flame className="mr-1 h-3 w-3" />
                      {topThree[2].current_streak} {t('days')}
                    </Badge>
                    <div className="flex h-24 w-full flex-col items-center justify-center rounded-t-lg border-2 border-amber-700 bg-gradient-to-b from-amber-200 via-orange-400 to-amber-600">
                      <span className="text-3xl font-bold text-white sm:text-4xl lg:text-6xl">
                        3
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of the leaderboard */}
            <div className="space-y-4">
              {others.map((item, index) => {
                const rank = index + 4;
                const streakMessage = getStreakMessage(item.current_streak);

                return (
                  <Card key={item.user.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className="bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-full text-base font-bold">
                          {rank}
                        </div>

                        {/* Avatar */}
                        <AvatarCustom
                          className="size-10 flex-shrink-0 border-2"
                          url={item.user.avatar_url}
                          fallback={item.user.username?.charAt(0).toUpperCase()}
                        />

                        {/* User Info */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {item.user.full_name || item.user.username}
                          </p>
                          <p className="text-muted-foreground truncate text-xs">
                            @{item.user.username}
                          </p>
                          {streakMessage && (
                            <p className="text-primary mt-0.5 text-xs font-medium">
                              {streakMessage}
                            </p>
                          )}
                        </div>

                        {/* Streak Info */}
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={getStreakBadgeVariant(item.current_streak)}
                            className="gap-1"
                          >
                            <Flame className="h-3 w-3" />
                            {item.current_streak} {t('days')}
                          </Badge>
                          <div className="text-muted-foreground flex items-center gap-1 text-xs">
                            <TrendingUp className="h-3 w-3" />
                            <span>
                              {t('highest')} {item.longest_streak}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <EmptyCustom title={t('noData')} description={t('errorDescription')} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
