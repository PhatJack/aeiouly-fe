import React from 'react';

import { cn } from '@/lib/utils';

import { Loader2 } from 'lucide-react';

interface LoadingWithTextProps {
  className?: string;
  text?: string;
  loadingSize?: number;
}

const LoadingWithText = ({ className, text, loadingSize }: LoadingWithTextProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className="h-5 w-5 animate-spin" size={loadingSize} />
      {text && <span className="text-sm text-gray-600 sm:text-base">{text}</span>}
    </div>
  );
};

export default LoadingWithText;
