'use client';

import React, { memo, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface PracticeInputProps {
  value: string;
  onChange: (value: string) => void;
  onCheck: () => void;
  onSkip: () => void;
}

const PracticeInput = memo(({ value, onChange, onCheck, onSkip }: PracticeInputProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        onCheck();
      }
    },
    [onCheck]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Type what you hear..."
          value={value}
          onChange={handleChange}
          className="min-h-[120px] resize-none md:text-lg"
          onKeyDown={handleKeyDown}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              onClick={onCheck}
              size={'lg'}
              disabled={!value.trim()}
              className="min-w-[100px]"
            >
              Check
            </Button>
            <Button variant="outline" size={'lg'} onClick={onSkip} className="min-w-[100px]">
              Skip
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

PracticeInput.displayName = 'PracticeInput';

export default PracticeInput;
