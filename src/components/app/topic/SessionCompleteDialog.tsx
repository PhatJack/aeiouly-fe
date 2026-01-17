import React from 'react';

import { useTranslations } from 'next-intl';

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
  const t = useTranslations('writing');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            <div className="text-center text-2xl font-bold">{t('sessionComplete.title')}</div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-center text-lg">{t('sessionComplete.description')}</p>
          <Button size="lg" className="min-w-[160px]" onClick={onViewResult}>
            {t('sessionComplete.viewResultButton')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionCompleteDialog;
