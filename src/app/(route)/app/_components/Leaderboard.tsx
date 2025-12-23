'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import AvatarCustom from '@/components/custom/AvatarCustom';
import PaginationCustom from '@/components/custom/PaginationCustom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetOnlineStreakLeaderboardQuery } from '@/services/online/get-leaderboard-online-streak.api';

import { Flame, TrendingUp, Trophy } from 'lucide-react';

const Leaderboard = () => {
  const { data, isLoading, error } = useGetOnlineStreakLeaderboardQuery();

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return 'default';
    if (streak >= 10) return 'secondary';
    if (streak >= 5) return 'outline';
    return 'outline';
  };

  if (isLoading) {
    return <LoadingWithText text="Đang tải bảng xếp hạng..." />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lỗi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Không thể tải bảng xếp hạng. Vui lòng thử lại sau.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hidden min-w-sm md:flex md:max-h-[calc(100dvh-5.75rem)]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <CardTitle>Bảng Xếp Hạng Streak</CardTitle>
        </div>
        <CardDescription>Top người dùng có chuỗi đăng nhập dài nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex flex-col">
          {data && data.leaderboard.length > 0 ? (
            <>
              {data.leaderboard.map((item, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={item.user.id}
                    className={`mb-3 flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md ${
                      rank === 1
                        ? 'bg-gradient-to-r from-yellow-100 to-transparent dark:from-amber-300/20'
                        : rank === 2
                          ? 'bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600/20'
                          : rank === 3
                            ? 'bg-gradient-to-r from-stone-400 to-transparent dark:from-yellow-900/20'
                            : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex size-12 items-center justify-center text-lg font-bold">
                      {index < 3 ? (
                        <Image
                          src={`/rank/rank${index + 1}.gif`}
                          alt={`Rank ${rank}`}
                          width={48}
                          height={48}
                          unoptimized
                        />
                      ) : (
                        getMedalEmoji(rank)
                      )}
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
                        {item.current_streak} ngày
                      </Badge>
                      {item.longest_streak > item.current_streak && (
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <TrendingUp className="h-3 w-3" />
                          <span>Cao nhất: {item.longest_streak}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="text-muted-foreground py-8 text-center">Chưa có dữ liệu xếp hạng</div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
