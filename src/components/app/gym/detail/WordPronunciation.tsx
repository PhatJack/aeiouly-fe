'use client';

import React, { useState } from 'react';

import LoadingWithText from '@/components/LoadingWithText';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CambridgeDictionaryResponse } from '@/lib/schema/dictionary.schema';
import { convertWordPos } from '@/lib/utils';

import PronunciationPlayer from './PronunciationPlayer';

interface Props {
  word: string;
}

const WordPronunciation: React.FC<Props> = ({ word }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CambridgeDictionaryResponse | { error: string } | null>(
    null
  );
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/dictionary?entry=${encodeURIComponent(word)}&language=en`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        const data: CambridgeDictionaryResponse = await response.json();
        setResult(data);
      }
    } catch (error) {
      console.error('Error fetching pronunciation data:', error);
    }
    setLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          onClick={async () => fetchData()}
          className="inline cursor-pointer border-b border-dashed border-gray-500 text-xl"
          role="button"
        >
          {word}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-2">
        {loading ? (
          <LoadingWithText text="Đang tải dữ liệu phát âm..." />
        ) : (
          <>
            <p>
              <strong className="text-lg">{result && 'word' in result && result?.word}</strong>
            </p>
            <div>
              {result && 'pronunciation' in result && result?.pronunciation && (
                <PronunciationPlayer pronunciations={result ? result.pronunciation : []} />
              )}
            </div>
            <Separator />
            <p>
              IPA for <strong>{result && 'word' in result && result?.word}</strong>
            </p>
            {result && 'pronunciation' in result && result?.pronunciation && (
              <div className="grid grid-cols-2 gap-2">
                {result.pronunciation.map((p, index) => (
                  <div key={index} className="space-y-1">
                    <div>
                      {p.pos && (
                        <span className="font-medium capitalize">{convertWordPos(p.pos)} </span>
                      )}
                      {p.lang && <span className="font-medium">[{p.lang}] </span>}
                      {p.pron && <span className="italic">{p.pron}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default WordPronunciation;
