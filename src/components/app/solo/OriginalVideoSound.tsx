'use client';

import React, { useCallback } from 'react';

import { Label } from '@/components/ui/label';
import { useSoloStore } from '@/hooks/use-solo-store';

import VolumeChange from './VolumeChange';

const OriginalVideoSound = () => {
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
          <strong>Original Video Sound</strong>
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
