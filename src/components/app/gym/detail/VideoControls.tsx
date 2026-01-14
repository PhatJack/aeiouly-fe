'use client';

import React, { memo } from 'react';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface VideoControlsProps {
  showVideo: boolean;
  onToggleVideo: () => void;
}

const VideoControls = memo(({ showVideo, onToggleVideo }: VideoControlsProps) => {
  const t = useTranslations('listening');

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="lg" onClick={onToggleVideo} className="ml-auto">
        {showVideo ? t('video.hide') : t('video.show')}
      </Button>
    </div>
  );
});

VideoControls.displayName = 'VideoControls';

export default VideoControls;
