import React, { memo, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

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
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ROUTE } from '@/configs/route';
import { useCompleteLessonMutation } from '@/services/learning-path';
import {
  useCompleteWritingSessionMutation,
  useGetFinalEvaluationQuery,
} from '@/services/writing-session';

import { toast } from 'sonner';

import FinalEvaluation from './FinalEvaluation';

interface EndSessionButtonProps {
  id?: number;
  lid?: number;
}

const EndSessionButton = ({ id, lid }: EndSessionButtonProps) => {
  const router = useRouter();
  const [showEvaluation, setShowEvaluation] = useState(false);
  const endWritingSession = useCompleteWritingSessionMutation();
  const { data, refetch, isLoading } = useGetFinalEvaluationQuery(id || 0, {
    enabled: false,
  });
  const completeLessonMutation = useCompleteLessonMutation({
    meta: {
      ignoreGlobal: true,
    },
  });

  const handleEndSession = () => {
    if (!id) return;
    endWritingSession.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message || 'Kết thúc phiên học thành công!');
        setShowEvaluation(true);
        refetch();
        if (lid) completeLessonMutation.mutateAsync(lid);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Đã có lỗi xảy ra khi kết thúc phiên học.');
      },
    });
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">Kết thúc sớm</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn chưa hoàn thành bài học này?</AlertDialogTitle>
            <AlertDialogDescription>
              Nếu bạn kết thúc sớm, tiến trình hiện tại của bạn sẽ không được lưu lại. Bạn có chắc
              chắn muốn kết thúc không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation} modal={true}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="max-h-[90vh] max-w-3xl min-w-3xl overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isLoading ? 'Đang tải kết quả...' : 'Kết quả đánh giá'}
            </DialogTitle>
            <DialogDescription>
              {isLoading
                ? 'Hệ thống đang đánh giá...'
                : 'Dưới đây là kết quả chi tiết về phiên học của bạn'}
            </DialogDescription>
          </DialogHeader>

          {data && <FinalEvaluation data={data} />}
          <DialogFooter className="sm:justify-center">
            {!isLoading && (
              <Button
                onClick={() => {
                  router.push(ROUTE.ONION);
                }}
                size="lg"
                className="min-w-[200px]"
              >
                Hoàn tất
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default memo(EndSessionButton);
