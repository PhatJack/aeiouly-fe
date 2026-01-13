'use client';

import React, { useCallback } from 'react';

import { useTranslations } from 'next-intl';

import { Label } from '@/components/ui/label';
import { useSoloStore } from '@/hooks/use-solo-store';

import VolumeChange from './VolumeChange';

const OriginalVideoSound = () => {
  const t = useTranslations('space');
  const { volume, setVolume } = useSoloStore();

  const debouncedSetVolume = useCallback(
    (val: number[]) => {
      setVolume(val[0]);
    },
    [setVolume]
  );

  const handleMute = useCallback(() => {
    setVolume(volume > 0 ? 0 : 100);
  }, [volume, setVolume]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="volume" className="flex items-center gap-1">
        <span>
          <strong>{t('videoSound.title')}</strong>
        </span>
      </Label>
      <VolumeChange
        debouncedSetVolume={debouncedSetVolume}
        handleMute={handleMute}
        volume={volume}
      />
    </div>
  );
};

export default React.memo(OriginalVideoSound);
