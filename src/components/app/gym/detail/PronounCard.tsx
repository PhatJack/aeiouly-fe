'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { Loader2 } from 'lucide-react';

import WordPronunciation from './WordPronunciation';

interface IPronounCardProps {
  words?: string[];
}

const PronounCard = ({ words }: IPronounCardProps) => {
  if (!words || words.length === 0) {
    return <div>Không có từ nào.</div>;
  }

  // We'll fetch per-word on user click in the client component
  const results = words.map((w) => ({ word: w }));

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xl">
          <h3 className="font-semibold">Phát âm</h3>
        </div>

        {results.map((r, index) => (
          <div key={index} className="mr-2 inline">
            <React.Suspense fallback={<Loader2 className="animate-spin" />}>
              <WordPronunciation word={r.word} />
            </React.Suspense>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PronounCard;
