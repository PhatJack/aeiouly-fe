import React, { useCallback, useEffect } from 'react';

import OriginalVideoSound from '@/components/app/solo/OriginalVideoSound';
import VolumeChange from '@/components/app/solo/VolumeChange';
import { Label } from '@/components/ui/label';
import { useSoloSoundStore } from '@/hooks/use-solo-sound-store';
import { useSoloStore } from '@/hooks/use-solo-store';
import { useGetAllSoundsQuery } from '@/services/sounds';

const SoundList = () => {
  const activeSounds = useSoloStore((state) => state.activeSounds);
  const saveActiveSounds = useSoloStore((state) => state.saveActiveSounds);
  const sounds = useSoloSoundStore((state) => state.sounds);
  const setSounds = useSoloSoundStore((state) => state.setSounds);
  const updateVolume = useSoloSoundStore((state) => state.updateVolume);
  const isInitialized = useSoloSoundStore((state) => state.isInitialized);
  const setInitialized = useSoloSoundStore((state) => state.setInitialized);
  const soundsQuery = useGetAllSoundsQuery();

  const soundsData = soundsQuery.data?.items;

  // Initialize sounds
  useEffect(() => {
    if (!soundsData || isInitialized) return;

    if (activeSounds && activeSounds.length > 0) {
      // Use saved sounds from SoloStore
      const validSounds = activeSounds
        .filter((sound) => sound.sound_file_url)
        .map((sound) => ({
          stream_url: sound.sound_file_url!,
          sound_name: sound.name,
          volume: 0,
        }));
      setSounds(validSounds);
    } else if (soundsData) {
      // Initialize with default values
      const validSounds = soundsData
        .filter((sound) => sound.sound_file_url)
        .map((sound) => ({
          stream_url: sound.sound_file_url!,
          sound_name: sound.name,
          volume: 0,
        }));
      setSounds(validSounds);
    }

    // Mark as initialized
    setInitialized(true);
  }, [soundsData, isInitialized, activeSounds, setSounds, setInitialized]);

  // Save sounds to SoloStore whenever they change
  useEffect(() => {
    if (sounds && sounds.length > 0) {
      saveActiveSounds(
        sounds.map((sound) => ({
          sound_file_url: sound.stream_url,
          name: sound.sound_name,
          volume: sound.volume,
        }))
      );
    }
  }, [sounds, saveActiveSounds]);

  // Handle volume change
  const handleVolumeChange = useCallback(
    (stream_url: string, volume: number) => {
      updateVolume(stream_url, volume);
    },
    [updateVolume]
  );

  return (
    <div className="bg-background flex w-full flex-col space-y-2 rounded-md p-4 shadow-lg">
      <OriginalVideoSound />
      {sounds?.map((sound, index) => (
        <div key={index} className="flex flex-col">
          <Label htmlFor="volume" className="flex items-center gap-1 text-xs">
            <span>
              <strong>{sound.sound_name}</strong>
            </span>
          </Label>
          <VolumeChange
            step={0.1}
            minValue={0}
            maxValue={1}
            debouncedSetVolume={(val: number[]) => handleVolumeChange(sound.stream_url, val[0])}
            volume={sound.volume}
            handleMute={() => handleVolumeChange(sound.stream_url, sound.volume > 0 ? 0 : 1)}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(SoundList);
