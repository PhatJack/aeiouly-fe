import React, { memo } from 'react';

import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface ConfirmLeavePopupProps {
  onStay: () => void;
  onLeave: () => void;
}

const ConfirmLeavePopup = memo(({ onStay, onLeave }: ConfirmLeavePopupProps) => {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có thay đổi chưa lưu</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn rời khỏi trang này? Các thay đổi của bạn sẽ không được lưu.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={onStay}>
              Ở lại
            </Button>
          </DialogClose>

          <Button onClick={onLeave}>Rời khỏi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ConfirmLeavePopup.displayName = 'ConfirmLeavePopup';

export default ConfirmLeavePopup;
