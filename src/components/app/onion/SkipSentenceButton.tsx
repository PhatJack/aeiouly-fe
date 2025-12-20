'use client';

import React, { memo, useCallback } from 'react';

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
import { SpeakingSessionContext } from '@/contexts/SpeakingSessionContext';
import { useSkipCurrentSpeakingSentenceMutation } from '@/services/speaking-session/skip-current-sentence.api';

import { Loader2 } from 'lucide-react';
import { useContextSelector } from 'use-context-selector';

interface SkipSentenceButtonProps {
  id?: number;
}

const SkipSentenceButton = ({ id }: SkipSentenceButtonProps) => {
  const setSkipCurrentSentenceResponse = useContextSelector(
    SpeakingSessionContext,
    (ctx) => ctx!.setSkipCurrentSentenceResponse
  );
  const skipSentenceMutation = useSkipCurrentSpeakingSentenceMutation();
  const handleClick = useCallback(async () => {
    await skipSentenceMutation.mutateAsync({ sessionId: id ?? 0 }).then((res) => {
      setSkipCurrentSentenceResponse(res);
    });
  }, [id, skipSentenceMutation]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="warning" size="lg" type="button">
          {skipSentenceMutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            'Bỏ qua'
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn muốn bỏ qua câu này</AlertDialogTitle>
          <AlertDialogDescription>
            Hãy cố gắng suy nghĩ và nói câu trả lời của bạn trước khi bỏ qua.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default memo(SkipSentenceButton);
