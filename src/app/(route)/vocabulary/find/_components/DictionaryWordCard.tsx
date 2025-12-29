'use client';

import React from 'react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DictionaryResponseSchema } from '@/lib/schema/dictionary.schema';
import { cn } from '@/lib/utils';

import { BookMarked, ChevronRight } from 'lucide-react';

interface DictionaryWordCardProps {
  word: DictionaryResponseSchema;
  onSelect: (word: DictionaryResponseSchema) => void;
  isSelected?: boolean;
}

const DictionaryWordCard: React.FC<DictionaryWordCardProps> = ({ word, onSelect, isSelected }) => {
  return (
    <Card
      className={cn(
        'hover:border-primary cursor-pointer transition-all duration-200',
        isSelected && 'border-primary ring-primary/20 ring-2'
      )}
      onClick={() => onSelect(word)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookMarked className="text-primary h-5 w-5" />
              {word.expression}
            </CardTitle>
            <CardDescription className="mt-1 text-xs">ID: {word.id}</CardDescription>
          </div>
          <ChevronRight
            className={cn(
              'text-muted-foreground h-5 w-5 transition-transform',
              isSelected && 'rotate-90'
            )}
          />
        </div>
      </CardHeader>
    </Card>
  );
};

export default DictionaryWordCard;
