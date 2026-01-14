'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useSoloStore } from '@/hooks/use-solo-store';
import {
  UserFavoriteVideoCreateSchema,
  userFavoriteVideoCreateSchema,
} from '@/lib/schema/user-favorite-video.schema';
import { useCreateUserFavoriteVideoMutation } from '@/services/user-favorite-videos';
import { zodResolver } from '@hookform/resolvers/zod';

import { toast } from 'sonner';

const AddFavoriteVideoModal = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('space');
  const { setBackground } = useSoloStore();
  const [open, setOpen] = useState(false);
  const [playVideoOpen, setPlayVideoOpen] = useState(false);
  const [videoEmbed, setVideoEmbed] = useState<string | undefined>(undefined);
  const createFavoriteMutation = useCreateUserFavoriteVideoMutation();

  const form = useForm<UserFavoriteVideoCreateSchema>({
    resolver: zodResolver(userFavoriteVideoCreateSchema),
    defaultValues: {
      youtube_url: '',
    },
  });

  const onSubmit = (data: UserFavoriteVideoCreateSchema) => {
    if (data.youtube_url === '') {
      toast.error(t('addVideo.emptyUrl'));
      return;
    }

    let url: URL;
    try {
      url = new URL(data.youtube_url);
    } catch {
      toast.error(t('addVideo.invalidUrl'));
      return;
    }
    const youtubeId = url.searchParams.get('v');
    if (!youtubeId) {
      toast.error(t('addVideo.invalidUrlLong'));
      return;
    }

    const normalizedUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

    createFavoriteMutation.mutate(
      { youtube_url: normalizedUrl },
      {
        onSuccess: () => {
          toast.success(t('addVideo.success'));
          form.reset();
          setOpen(false);
          // Save video embed info and show play confirmation dialog
          setVideoEmbed(normalizedUrl);
          setPlayVideoOpen(true);
        },
        onError: (error: any) => {
          const errorMessage = error?.detail || error?.message || t('addVideo.error');
          toast.error(errorMessage);
        },
      }
    );
  };

  const handlePlayVideo = () => {
    // Set the video as background
    if (videoEmbed) {
      setBackground(videoEmbed);
      toast.success(t('addVideo.playingSuccess'));
    }
    setPlayVideoOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('addVideo.modalTitle')}</DialogTitle>
            <DialogDescription>{t('addVideo.modalDescription')}</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                control={form.control}
                name="youtube_url"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>{t('addVideo.urlLabel')}</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder={t('addVideo.urlPlaceholder')}
                      autoComplete="off"
                    />
                    <p className="text-muted-foreground text-sm">
                      Ví dụ:{' '}
                      <span className="font-bold">https://www.youtube.com/watch?v=VIDEO_ID</span>
                    </p>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button type="submit" disabled={createFavoriteMutation.isPending}>
                {createFavoriteMutation.isPending ? t('addVideo.saving') : t('addVideo.saveSong')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Play Video Confirmation Dialog */}
      <Dialog open={playVideoOpen} onOpenChange={setPlayVideoOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('addVideo.playModalTitle')}</DialogTitle>
            <DialogDescription>{t('addVideo.playModalDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setPlayVideoOpen(false)}>
              {t('addVideo.playLater')}
            </Button>
            <Button onClick={handlePlayVideo}>{t('addVideo.playNow')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(AddFavoriteVideoModal);
