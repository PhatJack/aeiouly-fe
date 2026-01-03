'use client';

import React, { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { CambridgePronunciationData } from '@/lib/schema/dictionary.schema';

import { Volume2 } from 'lucide-react';

interface Props {
  pronunciations: CambridgePronunciationData[];
}

const PronunciationPlayer: React.FC<Props> = ({ pronunciations }) => {
  const play = useCallback((url?: string) => {
    if (!url) return;
    try {
      const audio = new Audio(url);
      // best-effort play
      audio.play().catch((err) => {
        // swallow play promise rejection in some browsers that require user gesture
        console.warn('Audio play failed', err);
      });
    } catch (err) {
      console.warn('Unable to play audio', err);
    }
  }, []);

  const findByLang = (pattern: RegExp) =>
    pronunciations.find((p) => (p.lang || '').toLowerCase().match(pattern));

  const uk = findByLang(/uk/i);
  const us = findByLang(/us/i);

  if (!uk && !us) return null;

  return (
    <div className="flex items-center gap-2">
      {uk && (
        <Button
          type="button"
          variant={'primary-outline'}
          onClick={() => play(uk.url)}
          aria-label="Phát âm UK"
        >
          UK
          <Volume2 />
        </Button>
      )}

      {us && (
        <Button
          type="button"
          variant={'primary-outline'}
          onClick={() => play(us.url)}
          aria-label="Phát âm US"
        >
          US
          <Volume2 />
        </Button>
      )}
    </div>
  );
};

export default PronunciationPlayer;
