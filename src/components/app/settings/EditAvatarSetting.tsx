'use client';

import React, { memo } from 'react';

import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants/image';
import { useAuthStore } from '@/contexts/AuthContext';
import { getFallbackInitials } from '@/lib/utils';
import { useUpdateUserImageMutation } from '@/services/auth/update-me-avatar.api';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { AVATAR_VIBRANT } from '../../../../public/avatars';

const EditAvatarSetting = () => {
  const user = useAuthStore((state) => state.user);

  const userImageMutation = useUpdateUserImageMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.size > MAX_FILE_SIZE) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }
    if (file && ACCEPTED_IMAGE_TYPES.indexOf(file.type) === -1) {
      toast.error('Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh PNG, JPG, JPEG hoặc WEBP.');
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
          loading: 'Đang cập nhật ảnh đại diện...',
          success: 'Cập nhật ảnh đại diện thành công!',
          error: (e: any) => e?.detail || 'Cập nhật ảnh đại diện thất bại!',
        }
      );
    }
  };

  return (
    <div className="flex gap-4">
      <AvatarCustom
        url={user?.avatar_url || ''}
        fallback={getFallbackInitials(user?.full_name || user?.username || 'User')}
        className="size-20 border"
      />
      <div className="flex flex-wrap gap-2">
        {AVATAR_VIBRANT.map((avatar, index) => (
          <Button
            key={`avatar-option-${index}`}
            size={'lg'}
            variant={'outline'}
            className="hover:border-primary relative size-12 overflow-hidden rounded-full border border-transparent transition-all"
          >
            <Image
              src={avatar}
              alt={`Avatar ${index + 1}`}
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
