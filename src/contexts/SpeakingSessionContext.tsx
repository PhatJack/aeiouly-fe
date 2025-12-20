'use client';

import { useCallback, useState } from 'react';

import { SpeakingChatMessageResponseSchema } from '@/lib/schema/speaking-session.schema';

import { createContext } from 'use-context-selector';

interface SpeakingSessionStateContext {
  currentSentenceIndex: number;
  handleSelectedSentenceIndex: (index: number) => void;
  skipCurrentSentenceResponse: SpeakingChatMessageResponseSchema | null;
  setSkipCurrentSentenceResponse: (response: SpeakingChatMessageResponseSchema | null) => void;
}

export const SpeakingSessionContext = createContext<SpeakingSessionStateContext | null>(null);

export const SpeakingSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [skipCurrentSentenceResponse, setSkipCurrentSentenceResponse] =
    useState<SpeakingChatMessageResponseSchema | null>(null);

  const handleSelectedSentenceIndex = useCallback((index: number) => {
    setCurrentSentenceIndex(index);
  }, []);

  return (
    <SpeakingSessionContext.Provider
      value={{
        currentSentenceIndex,
        handleSelectedSentenceIndex,
        skipCurrentSentenceResponse,
        setSkipCurrentSentenceResponse,
      }}
    >
      {children}
    </SpeakingSessionContext.Provider>
  );
};
