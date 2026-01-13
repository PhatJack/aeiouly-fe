'use client';

import React from 'react';

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

interface DeleteFavoriteVideoProps {
  videoId: number;
  videoTitle?: string;
  onDelete: (videoId: number) => void;
  children: React.ReactNode;
}

const DeleteFavoriteVideo = ({
  videoId,
  videoTitle,
  onDelete,
  children,
}: DeleteFavoriteVideoProps) => {
  const t = useTranslations('space');
  const handleDelete = () => {
    onDelete(videoId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteVideo.confirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteVideo.confirmDescription', { title: videoTitle || t('deleteVideo.fallbackTitle') })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={'ghost'}>{t('deleteVideo.cancel')}</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            asChild
          >
            <Button variant={'destructive'} type="button" onClick={handleDelete}>
              {t('deleteVideo.delete')}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default React.memo(DeleteFavoriteVideo);
