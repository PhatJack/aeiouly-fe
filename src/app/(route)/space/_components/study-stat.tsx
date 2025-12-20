'use client';

import React, { useMemo } from 'react';

import { useTheme } from 'next-themes';

import LoadingWithText from '@/components/LoadingWithText';
import TooltipCustom from '@/components/custom/TooltipCustom';
import { Separator } from '@/components/ui/separator';
import { useGetOnlineStreakStatsQuery } from '@/services/online';

import { ChartNoAxesColumn, Clock, OctagonAlert, Trophy, UserRoundCog } from 'lucide-react';

const StudyStat = () => {
  const { theme } = useTheme();
  const studyStatsQuery = useGetOnlineStreakStatsQuery();

  const studyStats = useMemo(() => studyStatsQuery.data, [studyStatsQuery]);

  const getLevelColor = (level: string | undefined) => {
    if (!level) return '#9CA3AF'; // Default color for undefined level
    const colorMap: Record<string, { light: string; dark: string }> = {
      newbie: { light: '#9CA3AF', dark: '#6B7280' },
      bronze: { light: '#CD7F32', dark: '#B87333' },
      silver: { light: '#C0C0C0', dark: '#A8A8A8' },
      gold: { light: '#FFD700', dark: '#FFC107' },
      diamond: { light: '#4DD0E1', dark: '#26C6DA' },
      legend: { light: '#FF5722', dark: '#FF7043' },
    };
    return colorMap[level]?.[theme === 'dark' ? 'dark' : 'light'];
  };

  const getLevelLabel = (level: string) => {
    const labelMap: Record<string, string> = {
      newbie: 'Người mới',
      bronze: 'Đồng',
      silver: 'Bạc',
      gold: 'Vàng',
      diamond: 'Kim cương',
      legend: 'Huyền thoại',
    };
    return labelMap[level] || level;
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

          {/* Level */}
          <div className="bg-muted/50 space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="bg-background flex h-11 w-11 items-center justify-center rounded-lg shadow-sm">
                <UserRoundCog />
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Cấp độ hiện tại</p>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-sm font-bold"
                  style={{
                    backgroundColor: getLevelColor(studyStats?.level) + '20',
                    color: getLevelColor(studyStats?.level),
                  }}
                >
                  {studyStats?.level ? getLevelLabel(studyStats.level) : 'N/A'}
                </span>
              </div>
            </div>

            {studyStats?.next_milestone && (
              <p className="text-muted-foreground text-xs">
                Còn{' '}
                <strong className="text-foreground">
                  {studyStats.remaining_to_next_milestone} ngày
                </strong>{' '}
                để đạt mốc{' '}
                <strong className="text-foreground">{studyStats.next_milestone} ngày</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyStat;
