import React, { memo, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'nextjs-toploader/app';

import LoadingWithText from '@/components/LoadingWithText';
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
import { useGetSpeakingFinalEvaluationQuery } from '@/services/speaking-session';

import FinalEvaluation from './FinalEvaluation';

interface EndSessionButtonProps {
  id?: number;
  lid?: number;
}

const EndSessionButton = ({ id, lid }: EndSessionButtonProps) => {
  const t = useTranslations('speaking');
  const router = useRouter();
  const [openEvaluation, setOpenEvaluation] = useState(false);
  const { data, refetch, isLoading } = useGetSpeakingFinalEvaluationQuery(id || 0, {
    enabled: false,
  });
  const completeLessonMutation = useCompleteLessonMutation({
    meta: {
      ignoreGlobal: true,
    },
  });

  const handleEnd = async () => {
    setOpenEvaluation(true);
    await refetch();
    if (lid) await completeLessonMutation.mutateAsync(lid);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full">{t('endSession.endEarly')}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('endSession.confirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('endSession.confirm.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('endSession.confirm.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnd}>
              {t('endSession.confirm.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={openEvaluation} onOpenChange={setOpenEvaluation}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="max-h-[90vh] max-w-3xl min-w-3xl overflow-y-auto px-4"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {t('endSession.evaluation.title')}
            </DialogTitle>
            <DialogDescription>{t('endSession.evaluation.description')}</DialogDescription>
          </DialogHeader>
          {isLoading && <LoadingWithText text={t('endSession.evaluation.loading')} />}
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
                {t('endSession.evaluation.complete')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(EndSessionButton);
