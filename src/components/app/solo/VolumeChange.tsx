import React from 'react';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  volume: number;
  handleMute: () => void;
  debouncedSetVolume: (val: number[]) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

const VolumeChange = ({
  debouncedSetVolume,
  handleMute,
  volume,
  minValue = 0,
  maxValue = 100,
  step = 5,
}: Props) => {
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        onClick={handleMute}
        size={'icon'}
        variant={'ghost'}
        className="hover:bg-transparent hover:text-black"
      >
        {volume > 0 ? <Volume2 /> : <VolumeX />}
      </Button>
      <Slider
        id="volume"
        step={step}
        min={minValue}
        max={maxValue}
        className=""
        value={[volume]}
        onValueChange={(value) => debouncedSetVolume(value)}
      />
    </div>
  );
};

export default React.memo(VolumeChange);
