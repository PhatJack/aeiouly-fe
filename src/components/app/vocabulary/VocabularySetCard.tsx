'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VocabularySetResponseSchema } from '@/lib/schema/vocabulary.schema';

import { Trash, WholeWord } from 'lucide-react';

interface VocabularySetCardProps {
  vocabularySet: VocabularySetResponseSchema;
  onDelete: (setId: number) => void;
  onView: (setId: number) => void;
}

const VocabularySetCard = ({ vocabularySet, onDelete, onView }: VocabularySetCardProps) => {
  return (
    <Card onClick={() => onView(vocabularySet.id)} className="cursor-pointer">
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{vocabularySet.name}</h3>
              {vocabularySet.is_default && (
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                  Mặc định
                </span>
              )}
            </div>
            {vocabularySet.description && (
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {vocabularySet.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="bg-primary size-6 rounded-full p-1">
                  <WholeWord className="h-4 w-4 text-white" />
                </span>
                <span className="text-base font-medium">{vocabularySet.total_words}</span>
                <span className="text-muted-foreground">từ</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!vocabularySet.is_default && (
              <>
                <Button
                  variant="error-outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(vocabularySet.id);
                  }}
                  className="border-none"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularySetCard;
