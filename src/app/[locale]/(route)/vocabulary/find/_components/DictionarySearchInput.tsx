'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounceValue } from '@/hooks/use-debounce-value';

import { Search, X } from 'lucide-react';

interface DictionarySearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const DictionarySearchInput: React.FC<DictionarySearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search vocabulary...',
  debounceMs = 500,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue] = useDebounceValue(localValue, debounceMs);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, value, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="h-12 px-10 text-base"
      />
      {localValue && (
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={handleClear}
          className="absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          aria-label="Clear search"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default DictionarySearchInput;
