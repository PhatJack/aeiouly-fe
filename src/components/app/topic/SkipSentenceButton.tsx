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
import { useSkipCurrentSentenceMutation } from '@/services/writing-session/skip-current-sentence.api';

interface SkipSentenceButtonProps {
  id?: number;
}

const SkipSentenceButton = ({ id }: SkipSentenceButtonProps) => {
  const skipSentenceMutation = useSkipCurrentSentenceMutation();
  const handleClick = useCallback(async () => {
    await skipSentenceMutation.mutateAsync({ sessionId: id ?? 0 }, {});
  }, [id]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="warning" size="lg" type="button">
          Bỏ qua
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn muốn bỏ qua câu này</AlertDialogTitle>
          <AlertDialogDescription>
            Hãy cố gắng suy nghĩ và viết câu trả lời của bạn trước khi bỏ qua.{' '}
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
