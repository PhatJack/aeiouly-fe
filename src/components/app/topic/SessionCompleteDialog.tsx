import React from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SessionCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewResult: () => void;
}

const SessionCompleteDialog: React.FC<SessionCompleteDialogProps> = ({
  open,
  onOpenChange,
  onViewResult,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center text-2xl font-bold">
              🎉 Chúc mừng bạn đã hoàn thành phiên học!
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-center text-lg">
            Bạn đã hoàn thành tất cả các câu trong phiên học này.
          </p>
          <Button size="lg" className="min-w-[160px]" onClick={onViewResult}>
            Xem kết quả
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionCompleteDialog;
