import React, { memo, useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('writing');
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
        toast.success(data.message || t('endSession.toast.success'));
        setShowEvaluation(true);
        refetch();
        if (lid) completeLessonMutation.mutateAsync(lid);
      },
      onError: (error: any) => {
        toast.error(error.message || t('endSession.toast.error'));
      },
    });
  };

  useEffect(() => {
    return () => {
      setShowEvaluation(false);
    };
  }, []);

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">{t('endSession.button')}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('endSession.alertDialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('endSession.alertDialog.description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('endSession.alertDialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndSession}>
              {t('endSession.alertDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          className="max-h-[90vh] max-w-3xl min-w-3xl overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {isLoading
                ? t('endSession.evaluationDialog.loadingTitle')
                : t('endSession.evaluationDialog.title')}
            </DialogTitle>
            <DialogDescription>
              {isLoading
                ? t('endSession.evaluationDialog.loadingDescription')
                : t('endSession.evaluationDialog.description')}
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
                {t('endSession.evaluationDialog.completeButton')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default memo(EndSessionButton);
