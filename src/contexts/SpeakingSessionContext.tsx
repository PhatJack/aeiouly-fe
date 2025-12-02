'use client';

import { useCallback, useState } from 'react';

import { createContext } from 'use-context-selector';

interface SpeakingSessionStateContext {
  currentSentenceIndex: number;
  handleSelectedSentenceIndex: (index: number) => void;
}

export const SpeakingSessionContext = createContext<SpeakingSessionStateContext | null>(null);

export const SpeakingSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const handleSelectedSentenceIndex = useCallback((index: number) => {
    setCurrentSentenceIndex(index);
  }, []);

  return (
    <SpeakingSessionContext.Provider
      value={{
        currentSentenceIndex,
        handleSelectedSentenceIndex,
      }}
    >
      {children}
    </SpeakingSessionContext.Provider>
  );
};
