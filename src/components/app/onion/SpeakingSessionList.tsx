import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSpeakingSessionsQuery } from '@/services/speaking-session';
import { useDeleteSpeakingSessionMutation } from '@/services/speaking-session';

import { toast } from 'sonner';

export const SpeakingSessionList = () => {
  const { data, isLoading, isError } = useGetSpeakingSessionsQuery({ page: 1, size: 50 });
  const deleteMutation = useDeleteSpeakingSessionMutation({
    onSuccess: () => {
      toast.success('Đã xóa phiên');
    },
  });

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
    return <p className="text-muted-foreground text-sm">Chưa có phiên nào. Hãy tạo phiên mới.</p>;
  }

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold lg:text-2xl">Phiên đã tạo</h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item: any) => (
          <Card key={item.id} className="flex flex-col justify-between p-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">
                #{item.id} • {item.my_character} ↔ {item.ai_character}
              </h3>
              <p className="text-muted-foreground line-clamp-2 text-xs">{item.scenario}</p>
              <div className="text-xs opacity-70">
                Cấp độ: {item.level} • Trạng thái: {item.status}
              </div>
              <div className="text-[10px] opacity-50">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast.info('Đi tới phiên #' + item.id)}
              >
                Mở
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(item.id)}
              >
                Xóa
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
