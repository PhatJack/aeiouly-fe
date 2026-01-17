'use client';

import React, { memo, useCallback } from 'react';

import { useTranslations } from 'next-intl';

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
import { WritingSessionContext } from '@/contexts/WritingSessionContext';
import { useSkipCurrentSentenceMutation } from '@/services/writing-session/skip-current-sentence.api';

import { Loader2 } from 'lucide-react';
import { useContextSelector } from 'use-context-selector';

interface SkipSentenceButtonProps {
  id?: number;
}

const SkipSentenceButton = ({ id }: SkipSentenceButtonProps) => {
  const t = useTranslations('writing');
  const handleSelectedSentenceIndex = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx!.handleSelectedSentenceIndex
  );
  const setSkipCurrentSentenceResponse = useContextSelector(
    WritingSessionContext,
    (ctx) => ctx!.setSkipCurrentSentenceResponse
  );
  const skipSentenceMutation = useSkipCurrentSentenceMutation();
  const handleClick = useCallback(async () => {
    await skipSentenceMutation.mutateAsync({ sessionId: id ?? 0 }).then((response) => {
      setSkipCurrentSentenceResponse(response);
      handleSelectedSentenceIndex?.(response.sentence_index || 0);
    });
  }, [id, skipSentenceMutation, setSkipCurrentSentenceResponse, handleSelectedSentenceIndex]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="warning" size="lg" type="button">
          {skipSentenceMutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            t('skip.button')
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('skip.alertDialog.title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('skip.alertDialog.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('skip.alertDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t('skip.alertDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(SkipSentenceButton);
