'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';

import {
  type SoloSoundStore,
  createSoloSoundStore,
  useSoloSoundAudioManager,
} from '@/stores/solo-sound-store';

import { useStore } from 'zustand';

export type SoloSoundStoreApi = ReturnType<typeof createSoloSoundStore>;

export const SoloSoundStoreContext = createContext<SoloSoundStoreApi | undefined>(undefined);

export interface SoloSoundStoreProviderProps {
  children: ReactNode;
}

export const SoloSoundProvider = ({ children }: SoloSoundStoreProviderProps) => {
  const storeRef = useRef<SoloSoundStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createSoloSoundStore();
  }

  // Get sounds from store and manage audio playback
  const sounds = useStore(storeRef.current, (state) => state.sounds);
  useSoloSoundAudioManager(sounds);

  return (
    <SoloSoundStoreContext.Provider value={storeRef.current}>
      {children}
    </SoloSoundStoreContext.Provider>
  );
};

export const useSoloSoundStore = <T,>(selector: (store: SoloSoundStore) => T): T => {
  const soloSoundStoreContext = useContext(SoloSoundStoreContext);

  if (!soloSoundStoreContext) {
    throw new Error(`useSoloSoundStore must be used within SoloSoundProvider`);
  }

  return useStore(soloSoundStoreContext, selector);
};
