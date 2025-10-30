'use client';

import React from 'react';

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
  const handleDelete = () => {
    onDelete(videoId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa{' '}
            <span className="font-bold">{videoTitle ? `"${videoTitle}"` : 'video này'}</span> khỏi
            danh sách yêu thích?
            <br />
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant={'ghost'}>Hủy</Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            asChild
          >
            <Button variant={'destructive'} type="button" onClick={handleDelete}>
              Xóa
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default React.memo(DeleteFavoriteVideo);
