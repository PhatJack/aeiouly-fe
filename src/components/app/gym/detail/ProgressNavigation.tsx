'use client';

import React, { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface ProgressNavigationProps {
  currentIndex: number;
  totalSentences: number;
  onPrevious: () => void;
  onNext: () => void;
}

const ProgressNavigation = memo(
  ({ currentIndex, totalSentences, onPrevious, onNext }: ProgressNavigationProps) => {
    return (
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous sentence"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="border-primary bg-primary/10 h-10 w-10 rounded-lg border-2"
              aria-label="Play sentence"
            >
              <Play className="text-primary h-5 w-5" />
            </Button>
            <span className="text-lg font-semibold">
              {currentIndex + 1} / {totalSentences}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={currentIndex === totalSentences - 1}
            aria-label="Next sentence"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </Card>
    );
  }
);

ProgressNavigation.displayName = 'ProgressNavigation';

export default ProgressNavigation;
