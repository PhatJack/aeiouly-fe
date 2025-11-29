'use client';

import { useCallback, useState } from 'react';

import { createContext } from 'use-context-selector';

interface SpeakingSessionStateContext {
  currentSentenceIndex: number;
  vietnameseSentences: string[];
  vietnameseText: string;
  handleSelectedSentenceIndex?: (index: number) => void;
  handleVietnameseSentences?: (sentences: string[]) => void;
  handleVietnameseText?: (text: string) => void;
}

export const SpeakingSessionContext = createContext<SpeakingSessionStateContext | null>(null);

export const SpeakingSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [vietnameseSentences, setVietnameseSentences] = useState<string[]>([]);
  const [vietnameseText, setVietnameseText] = useState<string>('');

  const handleSelectedSentenceIndex = useCallback((index: number) => {
    setCurrentSentenceIndex(index);
  }, []);

  const handleVietnameseSentences = useCallback((sentences: string[]) => {
    setVietnameseSentences(sentences);
  }, []);

  const handleVietnameseText = useCallback((text: string) => {
    setVietnameseText(text);
  }, []);

  return (
    <SpeakingSessionContext.Provider
      value={{
        currentSentenceIndex,
        vietnameseSentences,
        vietnameseText,
        handleSelectedSentenceIndex,
        handleVietnameseSentences,
        handleVietnameseText,
      }}
    >
      {children}
    </SpeakingSessionContext.Provider>
  );
};
