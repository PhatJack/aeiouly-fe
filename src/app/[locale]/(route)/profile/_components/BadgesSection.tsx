'use client';

import Image from 'next/image';

import LoadingWithText from '@/components/LoadingWithText';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useGetBadgesQuery, useGetMyBadgesQuery } from '@/services/badges';

export default function BadgesSection() {
  const { data: allBadgesRes, isLoading: isLoadingAll } = useGetBadgesQuery({ page: 1, size: 100 });
  const { data: myBadgesRes, isLoading: isLoadingMine } = useGetMyBadgesQuery({
    page: 1,
    size: 100,
  });

  if (isLoadingAll || isLoadingMine) {
    return <LoadingWithText text="Đang tải danh hiệu..." />;
  }

  const allBadges = allBadgesRes?.data?.items ?? [];
  const myBadges = myBadgesRes?.data?.items ?? [];

  // Map badge.id -> earned_at để biết cái nào đã đạt
  const earnedByBadgeId = new Map<number, string | Date>();
  for (const ub of myBadges) {
    earnedByBadgeId.set(ub.badge.id, ub.earned_at);
  }

  return (
    <Card className="overflow-hidden shadow-none">
      <CardHeader className="pb-3">
        <Label className="font-medium text-gray-500">Badges</Label>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {allBadges.map((badge) => {
            const imgSrc = badge.image_url || '/badges/day_7.png';

            const earnedAt = earnedByBadgeId.get(badge.id);
            const isEarned = Boolean(earnedAt);

            return (
              <HoverCard key={badge.id}>
                <HoverCardTrigger asChild>
                  <div
                    className={cn(
                      'group relative flex aspect-square items-center justify-center overflow-hidden transition',
                      !isEarned && 'opacity-60 grayscale'
                    )}
                    aria-label={badge.name}
                  >
                    <Image
                      src={imgSrc}
                      alt={badge.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  </div>
                </HoverCardTrigger>

                <HoverCardContent side="top" align="center">
                  <div className="flex gap-3">
                    <div className="bg-muted/20 flex size-12 shrink-0 items-center justify-center rounded-lg border p-2">
                      <Image
                        src={imgSrc}
                        alt={badge.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold">{badge.name}</p>
                        <span className="text-muted-foreground text-xs">{badge.rarity}</span>
                      </div>
                      <p className="text-muted-foreground mt-1 text-sm">{badge.description}</p>
                      {isEarned ? (
                        <p className="text-muted-foreground mt-2 text-xs">
                          Nhận lúc: {new Date(earnedAt as any).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
