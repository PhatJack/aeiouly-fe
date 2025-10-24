'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/button';

interface VideoControlsProps {
  showVideo: boolean;
  onToggleVideo: () => void;
}

const VideoControls = memo(({ showVideo, onToggleVideo }: VideoControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="lg" onClick={onToggleVideo} className="ml-auto">
        {showVideo ? 'Ẩn video' : 'Hiện video'}
      </Button>
    </div>
  );
});

VideoControls.displayName = 'VideoControls';

export default VideoControls;
