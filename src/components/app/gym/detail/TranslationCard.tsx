'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Eye, EyeOff } from 'lucide-react';

interface TranslationCardProps {
  translation: string;
  showTranslation: boolean;
  onToggle: () => void;
}

const TranslationCard = memo(({ translation, showTranslation, onToggle }: TranslationCardProps) => {
  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold">Bản dịch</h3>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          {showTranslation ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Ẩn
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Hiện
            </>
          )}
        </Button>
      </div>
      {showTranslation && <p className="text-muted-foreground">{translation}</p>}
      {translation && <p>Translated by Gemini 2.5 Pro</p>}
    </Card>
  );
});

TranslationCard.displayName = 'TranslationCard';

export default TranslationCard;
