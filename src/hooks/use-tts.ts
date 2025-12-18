'use client';

import { useCallback, useRef, useState } from 'react';

import { Communicate } from 'edge-tts-universal';

type SpeakOptions = {
  voice?: string;
  volume?: number;
  onEnd?: () => void;
};

export default function useTTS(defaultVoice = 'en-US-EmmaMultilingualNeural') {
  const cacheRef = useRef<Map<string, string>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentRef = useRef<{ url: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [voice, setVoice] = useState(defaultVoice);
  const [volume, setVolume] = useState(1);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentRef.current) {
      try {
        URL.revokeObjectURL(currentRef.current.url);
      } catch (e) {
        // ignore
      }
      currentRef.current = null;
    }
    setIsSpeaking(false);
    setIsAudioLoading(false);
  }, []);

  const speak = useCallback(
    async (text: string, opts?: SpeakOptions) => {
      if (!text) return;
      const useVoice = opts?.voice || voice;
      const useVolume = typeof opts?.volume === 'number' ? opts.volume : volume;

      const key = `${useVoice}::${text}`;
      let url = cacheRef.current.get(key);

      // Start loading/generation
      setIsAudioLoading(true);

      // If we already generated audio for this exact text+voice, reuse it
      if (url) {
        stop();
        const audio = new Audio(url);
        audio.volume = useVolume;
        audio.onended = () => {
          setIsSpeaking(false);
          opts?.onEnd?.();
        };
        audioRef.current = audio;
        currentRef.current = { url };
        setIsSpeaking(true);
        try {
          await audio.play();
        } finally {
          setIsAudioLoading(false);
        }
        return;
      }

      setIsSpeaking(true);
      try {
        // Create a new Communicate for this text (the library expects the text at construction)
        const communicate = new Communicate(text, { voice: useVoice } as any);
        const buffers: any[] = [];

        for await (const chunk of communicate.stream() as any) {
          if (chunk?.type === 'audio' && chunk.data) {
            buffers.push(chunk.data);
          }
        }

        const blob = new Blob(buffers, { type: 'audio/wav' });
        url = URL.createObjectURL(blob);
        cacheRef.current.set(key, url);

        stop();
        const audio = new Audio(url);
        audio.volume = useVolume;
        audio.onended = () => {
          setIsSpeaking(false);
          opts?.onEnd?.();
        };
        audioRef.current = audio;
        currentRef.current = { url };
        try {
          await audio.play();
        } finally {
          setIsAudioLoading(false);
        }
      } catch (err) {
        setIsSpeaking(false);
        setIsAudioLoading(false);
        throw err;
      }
    },
    [stop, voice, volume]
  );

  return {
    speak,
    stop,
    isSpeaking,
    isAudioLoading,
    voice,
    setVoice,
    volume,
    setVolume,
  } as const;
}
