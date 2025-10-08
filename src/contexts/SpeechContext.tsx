'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SpeakOptions, useSpeechSynthesis } from 'react-speech-kit';

interface SpeechContextType {
  cancel: () => void;
  speaking: boolean;
  speakingMessageId: string | null;
  speak: (options: SpeakOptions & { messageId?: string }) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string | undefined;
  setSelectedVoice: (voice: string) => void;
}

const SpeechContext = createContext<SpeechContextType | undefined>(undefined);

export const SpeechProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { voices, speaking, speak: originalSpeak, cancel: originalCancel } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(
    'Microsoft David - English (United States)'
  );
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const availableVoices = useMemo(
    () => voices.filter((voice) => voice.lang.includes('en-US')),
    [voices]
  );

  const speak = useCallback(
    (options: SpeakOptions & { messageId?: string }) => {
      setSpeakingMessageId(options.messageId || null);
      originalSpeak({
        ...options,
      });
    },
    [originalSpeak]
  );

  const cancel = useCallback(() => {
    setSpeakingMessageId(null);
    originalCancel();
  }, [originalCancel]);

  return (
    <SpeechContext.Provider
      value={{
        cancel,
        speaking,
        speakingMessageId,
        speak,
        voices: availableVoices,
        selectedVoice,
        setSelectedVoice,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeechContext = () => {
  const context = useContext(SpeechContext);
  if (context === undefined) {
    throw new Error('useSpeechContext must be used within a SpeechProvider');
  }
  return context;
};
