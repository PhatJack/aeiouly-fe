'use client';

import { useCallback, useRef, useState } from 'react';

type SpeakOptions = {
  voice?: string;
  volume?: number;
  rate?: number;
  pitch?: number;
  onEnd?: () => void;
};

export default function useTTSDefault(defaultGender: 'male' | 'female' = 'female') {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isStoppingRef = useRef(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const stop = useCallback(() => {
    isStoppingRef.current = true;
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onerror = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsAudioLoading(false);
    setTimeout(() => {
      isStoppingRef.current = false;
    }, 100);
  }, []);

  const speak = useCallback(
    async (text: string, opts?: SpeakOptions) => {
      if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

      // Stop any ongoing speech
      stop();

      setIsAudioLoading(true);
      setIsSpeaking(true);

      try {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice properties
        utterance.volume = opts?.volume ?? 1;
        utterance.rate = opts?.rate ?? 1;
        utterance.pitch = opts?.pitch ?? 1;

        // Select voice based on gender
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice: SpeechSynthesisVoice | undefined;

        // If specific voice name provided, try to find it
        if (opts?.voice) {
          selectedVoice = voices.find((v) => v.name.includes(opts.voice!));
        }

        // If no specific voice or not found, select by gender
        if (!selectedVoice) {
          if (defaultGender === 'male') {
            // Try to find male voices (common patterns)
            selectedVoice = voices.find(
              (v) =>
                v.name.toLowerCase().includes('male') ||
                v.name.includes('David') ||
                v.name.includes('Mark') ||
                v.name.includes('James') ||
                v.name.includes('George')
            );
          } else {
            // Try to find female voices (common patterns)
            selectedVoice = voices.find(
              (v) =>
                v.name.toLowerCase().includes('female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Victoria') ||
                v.name.includes('Karen') ||
                v.name.includes('Zira')
            );
          }
        }

        // Fallback to any English voice if gender-specific not found
        if (!selectedVoice) {
          selectedVoice = voices.find((v) => v.lang.startsWith('en'));
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
          if (!isStoppingRef.current) {
            setIsSpeaking(false);
            setIsAudioLoading(false);
            opts?.onEnd?.();
          }
        };

        utterance.onerror = (error) => {
          if (!isStoppingRef.current) {
            console.error('Speech synthesis error:', error);
            setIsSpeaking(false);
            setIsAudioLoading(false);
          }
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);

        // Loading is finished once speech starts
        setIsAudioLoading(false);
      } catch (err) {
        console.error('Error in speak:', err);
        setIsSpeaking(false);
        setIsAudioLoading(false);
        throw err;
      }
    },
    [stop, defaultGender]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isAudioLoading,
  } as const;
}
