'use client';

import React, { memo } from 'react';

import { Card, CardContent } from '@/components/ui/card';

interface TranslationCardProps {
  translation: string;
}

const TranslationCard = memo(({ translation }: TranslationCardProps) => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-xl">
          <h3 className="font-semibold">Bản dịch</h3>
        </div>
        {<p className="text-xl">{translation}</p>}
        {
          <p className="w-full text-right text-sm">
            <i>Dịch bởi Gemini 2.5 Pro</i>
          </p>
        }
      </CardContent>
    </Card>
  );
});

TranslationCard.displayName = 'TranslationCard';

export default TranslationCard;
