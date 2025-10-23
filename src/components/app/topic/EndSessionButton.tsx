import React, { memo } from 'react';

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
  useCompleteWritingSessionMutation,
  useGetFinalEvaluationQuery,
} from '@/services/writing-session';

interface EndSessionButtonProps {
  id?: number;
}

const EndSessionButton = ({ id }: EndSessionButtonProps) => {
  const endWritingSession = useCompleteWritingSessionMutation();
  const { data, refetch } = useGetFinalEvaluationQuery(id || 0, {
    enabled: false,
  });

  const handleEndSession = () => {
    if (!id) return;
    endWritingSession.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
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
  );
};
export default memo(EndSessionButton);
