'use client';

import React, { useMemo } from 'react';

import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import { cn } from '@/lib/utils';
import { useGetOnlineStreakStatsQuery } from '@/services/online';

import { Clock, Trophy, UserRoundCog } from 'lucide-react';

const StudyStat = () => {
  const studyStatsQuery = useGetOnlineStreakStatsQuery();

  const studyStats = useMemo(() => studyStatsQuery.data, [studyStatsQuery]);

  const getLevelBadge = (level: string) => {
    const labelMap: Record<string, string> = {
      newbie: '/streak-rank/newbie.png',
      bronze: '/streak-rank/bronze.png',
      silver: '/streak-rank/silver.png',
      gold: '/streak-rank/gold.png',
      diamond: '/streak-rank/diamond.png',
      legend: '/streak-rank/legend.png',
    };
    return labelMap[level] || '/streak-rank/newbie.png';
  };

  const getLevelLabel = (level: string) => {
    const labelMap: Record<string, string> = {
      newbie: 'Mọt sách', // Cách gọi vui vẻ
      bronze: 'Học viên',
      silver: 'Học khá',
      gold: 'Học giỏi',
      diamond: 'Học bá', // Từ lóng chỉ người học cực giỏi (Top tier)
      legend: 'Học thần', // Trên cả Học bá, đẳng cấp thần thánh
    };
    return labelMap[level] || level;
  };

  const rankStyles: Record<string, string> = {
    newbie: 'text-slate-500 font-medium',
    bronze:
      'bg-gradient-to-r from-orange-700 to-orange-500 bg-clip-text text-transparent drop-shadow-sm',
    silver:
      'bg-gradient-to-r from-slate-400 via-gray-300 to-slate-400 bg-clip-text text-transparent drop-shadow',
    gold: 'bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-md shadow-yellow-500/50',
    diamond:
      'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    legend:
      'bg-gradient-to-r from-fuchsia-500 via-red-500 to-orange-500 bg-clip-text text-transparent animate-shine bg-[length:200%_auto] drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]',
  };

  return (
    <div className="bg-background w-full rounded-lg p-4 shadow-sm">
      {studyStatsQuery.isLoading ? (
        <LoadingWithText text="Đang tải thống kê..." />
      ) : (
        <div className="grid gap-3">
          {/* Current streak */}
          <div className="group bg-muted/50 hover:bg-muted flex items-center gap-4 rounded-lg border p-4 transition">
            <div className="bg-background flex h-11 w-11 items-center justify-center rounded-lg shadow-sm">
              <Clock className="text-primary" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Chuỗi hiện tại</p>
              <p className="text-2xl font-extrabold">
                {studyStats?.current_streak ?? 0}
                <span className="ml-1 text-sm font-medium">ngày</span>
              </p>
            </div>
          </div>

          {/* Longest streak */}
          <div className="group bg-muted/50 hover:bg-muted flex items-center gap-4 rounded-lg border p-4 transition">
            <div className="bg-background flex h-11 w-11 items-center justify-center rounded-lg shadow-sm">
              <Trophy className="text-yellow-500" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Chuỗi dài nhất</p>
              <p className="text-2xl font-extrabold">
                {studyStats?.longest_streak ?? 0}
                <span className="ml-1 text-sm font-medium">ngày</span>
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {studyStats?.level && (
                  <Image
                    width={80}
                    height={80}
                    src={getLevelBadge(studyStats.level)}
                    alt={getLevelLabel(studyStats.level)}
                    sizes="100vw"
                    className="object-contain drop-shadow-lg transition-transform group-hover:scale-110"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-xs font-medium">Cấp độ của bạn</p>
                {studyStats?.level && (
                  <p className={cn(rankStyles[studyStats.level], 'text-2xl font-extrabold')}>
                    {getLevelLabel(studyStats.level)}
                  </p>
                )}
              </div>
            </div>

            {studyStats?.next_milestone && (
              <div className="bg-background/50 mt-3 rounded-sm p-2">
                <p className="text-muted-foreground text-xs">
                  Còn{' '}
                  <strong className="text-primary">
                    {studyStats.remaining_to_next_milestone} ngày
                  </strong>{' '}
                  để đạt mốc{' '}
                  <strong className="text-primary">{studyStats.next_milestone} ngày</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyStat;
