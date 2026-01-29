'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/image';
import { useAuthStore } from '@/contexts/AuthContext';
import { getFallbackInitials, urlToFile } from '@/lib/utils';
import { useUpdateUserImageMutation } from '@/services/auth/update-me-avatar.api';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { AVATAR_VIBRANT, AVATAR_ZODIAC } from '../../../../public/avatars';

const EditAvatarSetting = () => {
  const t = useTranslations('profile.avatarUpdate');
  const tError = useTranslations('error.avatar');

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const userImageMutation = useUpdateUserImageMutation();

  const handleAvatarClick = async (avatarUrl: string, index: number) => {
    try {
      const file = await urlToFile(avatarUrl, `avatar-${index + 1}.png`);

      toast.promise(
        userImageMutation.mutateAsync({
          body: {
            image: file,
          },
        }),
        {
          loading: t('updating'),
          success: (response) => {
            setUser(response.data);
            return response?.code ? t('updateSuccess') : t('updateSuccess');
          },
          error: (e: any) => e?.detail || tError('updateFailed'),
        }
      );
    } catch (error) {
      toast.error(tError('loadFailed'));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error(tError('fileSizeExceeded'));
      return;
    }
    if (file && ACCEPTED_IMAGE_TYPES.indexOf(file.type) === -1) {
      toast.error(tError('invalidFormat'));
      return;
    }

    if (file) {
      toast.promise(
        userImageMutation.mutateAsync({
          body: {
            image: file,
          },
        }),
        {
          loading: t('updating'),
          success: (response) => {
            setUser(response.data);
            return response?.code ? t('updateSuccess') : t('updateSuccess');
          },
          error: (e: any) => e?.detail || tError('updateFailed'),
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <AvatarCustom
        url={user?.avatar_url || undefined}
        fallback={getFallbackInitials(user?.full_name || user?.username || 'User')}
        className="size-20 border"
      />
      <div className="flex flex-wrap justify-center gap-1.5 sm:justify-start sm:gap-2">
        {AVATAR_VIBRANT.map((avatar, index) => (
          <Button
            key={`avatar-option-${index}`}
            size={'lg'}
            variant={'outline'}
            onClick={() => handleAvatarClick(avatar.src, index)}
            disabled={userImageMutation.isPending}
            title={`${t('selectAvatar')} ${index + 1}`}
            className="hover:border-primary dark:hover:border-primary relative size-12 overflow-hidden rounded-full border border-transparent px-0 transition-all disabled:opacity-50"
          >
            <Image
              src={avatar}
              alt={`Avatar ${index + 1}`}
              blurDataURL={avatar.blurDataURL}
              placeholder="blur"
              sizes="200px"
              fill
              className="object-cover"
            />
          </Button>
        ))}
        {AVATAR_ZODIAC.map((avatar, index) => (
          <Button
            key={`avatar-option-zodiac-${index}`}
            size={'lg'}
            variant={'outline'}
            onClick={() => handleAvatarClick(avatar.src, index)}
            disabled={userImageMutation.isPending}
            title={`${t('selectZodiacAvatar')} ${index + 1}`}
            className="hover:border-primary dark:hover:border-primary relative size-12 overflow-hidden rounded-full border border-transparent px-0 transition-all disabled:opacity-50"
          >
            <Image
              src={avatar}
              alt={`Avatar Zodiac ${index + 1}`}
              blurDataURL={avatar.blurDataURL}
              placeholder="blur"
              sizes="200px"
              fill
              className="object-cover"
            />
          </Button>
        ))}
        <Button
          size="lg"
          variant="outline"
          className="hover:border-primary relative size-12 rounded-full border-dashed bg-transparent transition-all"
        >
          <Plus />
          <Input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 file:hidden"
          />
        </Button>
      </div>
    </div>
  );
};

export default memo(EditAvatarSetting);
