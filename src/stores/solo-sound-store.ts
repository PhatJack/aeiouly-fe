import { useEffect, useRef } from 'react';

import { createStore } from 'zustand';

export type Sound = {
  stream_url: string;
  sound_name: string;
  volume: number;
};

export type SoloSoundState = {
  sounds: Sound[] | null;
  isInitialized: boolean;
};

export type SoloSoundActions = {
  setSounds: (sounds: Sound[]) => void;
  updateVolume: (stream_url: string, volume: number) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
};

export type SoloSoundStore = SoloSoundState & SoloSoundActions;

export const defaultSoloSoundStore: SoloSoundState = {
  sounds: null,
  isInitialized: false,
};

export const createSoloSoundStore = (initState: SoloSoundState = defaultSoloSoundStore) => {
  return createStore<SoloSoundStore>()((set) => ({
    ...initState,
    setSounds: (sounds) => set({ sounds }),
    updateVolume: (stream_url, volume) =>
      set((state) => ({
        sounds: state.sounds
          ? state.sounds.map((sound) =>
              sound.stream_url === stream_url ? { ...sound, volume } : sound
            )
          : null,
      })),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
    reset: () => set(defaultSoloSoundStore),
  }));
};

// Audio management singleton
class AudioManager {
  private audioMap = new Map<string, HTMLAudioElement>();
  private playingAudios = new Set<string>();

  handlePlayback(stream_url: string, volume: number) {
    if (!this.audioMap.has(stream_url)) {
      const audio = new Audio(stream_url);
      audio.volume = volume;
      audio.loop = true;
      this.audioMap.set(stream_url, audio);
    }

    const audio = this.audioMap.get(stream_url);
    if (audio) {
      audio.volume = volume;

      if (volume > 0) {
        if (audio.paused) {
          audio.play().catch((error) => console.log('Error playing audio:', error));
        }
        this.playingAudios.add(stream_url);
      } else {
        audio.pause();
        this.playingAudios.delete(stream_url);
      }
    }
  }

  cleanup() {
    this.audioMap.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.audioMap.clear();
    this.playingAudios.clear();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Hook to manage audio playback
export const useSoloSoundAudioManager = (sounds: Sound[] | null) => {
  const isCleanedUp = useRef(false);

  useEffect(() => {
    if (sounds) {
      sounds.forEach((sound) => {
        audioManager.handlePlayback(sound.stream_url, sound.volume);
      });
    }
  }, [sounds]);

  useEffect(() => {
    return () => {
      if (!isCleanedUp.current) {
        audioManager.cleanup();
        isCleanedUp.current = true;
      }
    };
  }, []);
};
