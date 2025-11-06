'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Eye, EyeOff } from 'lucide-react';

interface TranslationCardProps {
  translation: string;
}

const TranslationCard = memo(({ translation }: TranslationCardProps) => {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Bản dịch</h3>
      </div>
      {<p className="text-xl">{translation}</p>}
      {<p>Translated by Gemini 2.5 Pro</p>}
    </Card>
  );
});

TranslationCard.displayName = 'TranslationCard';

export default TranslationCard;
