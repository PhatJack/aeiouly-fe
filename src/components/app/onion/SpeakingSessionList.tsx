import React, { useCallback, useState } from 'react';

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
import { cn, getLevelColor } from '@/lib/utils';
import { useGetSpeakingSessionsQuery } from '@/services/speaking-session';
import { useDeleteSpeakingSessionMutation } from '@/services/speaking-session';

import { CalendarClock, MessageSquare, MoveRight, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const SpeakingSessionList = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetSpeakingSessionsQuery({ page: 1, size: 50 });
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteSpeakingSessionMutation();

  const handleDelete = useCallback(
    async (id: number) => {
      toast.promise(deleteMutation.mutateAsync(id), {
        loading: 'Đang xoá ...',
        success: 'Xoá phiên thành công!',
        error: (e: any) => e?.detail || 'Xoá phiên thất bại. Vui lòng thử lại.',
      });
    },
    [deleteMutation]
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
    return <p className="text-sm text-red-500">Lỗi tải danh sách phiên.</p>;
  }
  if (!data || data.items.length === 0) {
    return (
      <EmptyCustom
        icon={<MessageSquare className="h-12 w-12 text-green-500" />}
        title="Chưa có phiên nói chuyện nào"
        description="Bắt đầu một phiên nói chuyện mới để cải thiện kỹ năng nói của bạn!"
      />
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold lg:text-2xl">Phiên đã tạo</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {data.items.map((item: any) => {
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
                router.push(`/onion/${item.id}`);
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
                        Level: {item.level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground line-clamp-2 text-sm">{item.scenario}</p>

              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <CalendarClock className="size-3.5" /> {createdAt}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/onion/${item.id}`);
                  }}
                  aria-label={`Mở phiên #${item.id}`}
                >
                  <MoveRight />
                  <span>Tiếp tục</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={deleteMutation.isPending && pendingDeleteId === item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      aria-label={`Xóa phiên #${item.id}`}
                    >
                      <Trash2 className="size-4" /> <span>Xóa phiên</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xóa phiên #{item.id}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Thao tác này không thể hoàn tác. Phiên và dữ liệu liên quan sẽ bị xóa.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending && pendingDeleteId === item.id}
                      >
                        Xác nhận
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
