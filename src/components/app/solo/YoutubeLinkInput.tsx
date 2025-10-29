import React, { useCallback, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSoloStore } from '@/hooks/use-solo-store';
import { UrlToEmbeded } from '@/lib/utils';

import debounce from 'lodash.debounce';
import { Info } from 'lucide-react';

import VolumeChange from './VolumeChange';

const YoutubeLinkInput = () => {
  const [errorLink, setErrorLink] = useState<boolean>(false);
  const { setVolume, volume, backgroundURL, setBackground } = useSoloStore();
  const [inputValue, setInputValue] = useState(backgroundURL || '');

  const debouncedSetVolume = useCallback(
    (val: number[]) => {
      setVolume(val[0]);
    },
    [setVolume]
  );

  const handleMute = useCallback(() => {
    setVolume(volume > 0 ? 0 : 100);
  }, [volume, setVolume]);

  // Create a debounced function to validate and update the background
  const debouncedUpdateBackground = useCallback(
    debounce((value: string) => {
      if (value === '') {
        setErrorLink(false);
        return;
      }
      const video = UrlToEmbeded(value);
      if (video) {
        setErrorLink(false);
        setBackground(value);
      } else {
        setErrorLink(true);
      }
    }, 500),
    [setBackground]
  );

  // Handle input change immediately for UI responsiveness
  const handleChangeBackground = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue); // Update input value immediately
      debouncedUpdateBackground(newValue); // Validate and update background after debounce
    },
    [debouncedUpdateBackground]
  );

  // Update inputValue if backgroundURL changes externally
  useEffect(() => {
    if (backgroundURL !== inputValue) {
      setInputValue(backgroundURL || '');
    }
  }, [backgroundURL]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="youtube-link" className="flex items-center gap-1">
          <span>
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="size-4 fill-[#FF0000]"
            >
              <title>YouTube</title>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </span>
          <span>
            <strong>Youtube Video</strong>
          </span>
        </Label>
        <Input
          id="youtube-link"
          type="text"
          value={inputValue}
          onChange={handleChangeBackground}
          placeholder="Paste the youtube link here"
          className="border-muted"
        />
        {errorLink && (
          <p className="border-destructive flex items-center gap-2 rounded-md border p-2">
            <Info size={16} className="text-destructive" />
            <span className="text-destructive text-sm">Invalid Youtube link</span>
          </p>
        )}
      </div>
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
    </>
  );
};

export default YoutubeLinkInput;
