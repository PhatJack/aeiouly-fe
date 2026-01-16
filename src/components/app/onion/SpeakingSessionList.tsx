import React, { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import EmptyCustom from '@/components/custom/EmptyCustom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE } from '@/configs/route';
import { SpeakingSessionListItemSchema } from '@/lib/schema/speaking-session.schema';
import { cn, getLevelColor } from '@/lib/utils';
import { useGetSpeakingSessionsQuery } from '@/services/speaking-session';
import { useDeleteSpeakingSessionMutation } from '@/services/speaking-session';

import { CalendarClock, MessageSquare, MoveRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const SpeakingSessionList = () => {
  const t = useTranslations('speaking');
  const router = useRouter();
  const { data, isLoading, isError } = useGetSpeakingSessionsQuery({ page: 1, size: 50 });
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteSpeakingSessionMutation();

  const handleDelete = useCallback(
    async (id: number) => {
      toast.promise(deleteMutation.mutateAsync(id), {
        loading: t('sessionList.loading'),
        success: t('sessionList.deleteSuccess'),
        error: (e: any) => e?.detail || t('sessionList.deleteError'),
      });
    },
    [deleteMutation, t]
  );

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }
  if (isError) {
    return <p className="text-sm text-red-500">{t('sessionList.error')}</p>;
  }
  if (!data || data.items.length === 0) {
    return (
      <EmptyCustom
        icon={<MessageSquare className="h-12 w-12 text-green-500" />}
        title={t('sessionList.empty.title')}
        description={t('sessionList.empty.description')}
      />
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold lg:text-2xl">{t('sessionList.createdSessions')}</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {data.items.map((item: SpeakingSessionListItemSchema) => {
          const createdAt = new Date(item.created_at).toLocaleString();
          const initials = (name: string) =>
            (name || '')
              .split(' ')
              .map((s: string) => s[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

          return (
            <Card
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button,[role="menuitem"],[data-radix-popper-content-wrapper]'))
                  return;
                if (item.status === 'active') {
                  router.push(`${ROUTE.ONION}/${item.id}`);
                }
              }}
              className="group focus:ring-ring/30 flex flex-col justify-between gap-3 p-4 transition-all hover:shadow-md focus:ring-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex -space-x-3">
                    <Avatar className="ring-background ring-2">
                      <AvatarFallback>{initials(item.my_character)}</AvatarFallback>
                    </Avatar>
                    <Avatar className="ring-background ring-2">
                      <AvatarFallback>{initials(item.ai_character)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold">
                      {item.my_character} ↔ {item.ai_character}
                    </h3>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline" className={cn(getLevelColor(item.level))}>
                        {t('sessionList.level')}: {item.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm">{item.scenario}</p>
              <div className="text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs">
                  <CalendarClock className="size-3.5" /> {createdAt}
                </span>
                {item.status === 'completed' && (
                  <Badge variant="success">{t('sessionList.completed')}</Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {item.status === 'active' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${ROUTE.ONION}/${item.id}`);
                    }}
                    aria-label={t('sessionList.openSession', { id: item.id })}
                  >
                    <MoveRight />
                    <span>{t('sessionList.continue')}</span>
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      aria-label={t('sessionList.deleteSession', { id: item.id })}
                    >
                      <Trash2 className="size-4" /> <span>{t('sessionList.delete')}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t('sessionList.deleteConfirm.title', { id: item.id })}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('sessionList.deleteConfirm.description')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>
                        {t('sessionList.deleteConfirm.cancel')}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending && pendingDeleteId === item.id}
                      >
                        {t('sessionList.deleteConfirm.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
