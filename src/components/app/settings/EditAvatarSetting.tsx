import React, { memo } from 'react';

import Image from 'next/image';

import AvatarCustom from '@/components/custom/AvatarCustom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/contexts/AuthContext';
import { getFallbackInitials } from '@/lib/utils';

import { Plus } from 'lucide-react';

import { AVATAR_VIBRANT } from '../../../../public/avatars';

const EditAvatarSetting = () => {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex gap-2">
      <AvatarCustom
        url={user?.avatar_url || ''}
        fallback={getFallbackInitials(user?.full_name || user?.username || 'User')}
        className="size-16 border"
      />
      <div className="flex flex-wrap gap-2">
        {AVATAR_VIBRANT.map((avatar, index) => (
          <Button
            key={`avatar-option-${index}`}
            size={'lg'}
            variant={'outline'}
            className="hover:border-primary size-12 overflow-hidden rounded-full border border-transparent transition-all"
          >
            <Image src={avatar} alt={`Avatar ${index + 1}`} className="h-full w-full" />
          </Button>
        ))}
        <Button
          size={'lg'}
          variant={'outline'}
          className="hover:border-primary size-12 rounded-full border-dashed bg-transparent transition-all"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default memo(EditAvatarSetting);
