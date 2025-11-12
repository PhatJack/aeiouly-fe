import React, { HTMLAttributes, memo } from 'react';

import { cn } from '@/lib/utils';

import { Label } from '../ui/label';

interface BlockquoteCustomProps {
  variants?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  content: React.ReactNode;
  contentClassName?: HTMLAttributes<HTMLDivElement>['className'];
}

const variantStyles = {
  primary: {
    backgroundColor: 'bg-primary',
    backgroundColorLight: 'bg-primary/10',
    borderColor: 'border-primary',
  },
  secondary: {
    backgroundColor: 'bg-secondary',
    backgroundColorLight: 'bg-secondary/10',
    borderColor: 'border-secondary',
  },
  muted: {
    backgroundColor: 'bg-muted',
    backgroundColorLight: 'bg-muted/10',
    borderColor: 'border-muted',
  },
  success: {
    backgroundColor: 'bg-success',
    backgroundColorLight: 'bg-success/10',
    borderColor: 'border-success',
  },
  warning: {
    backgroundColor: 'bg-warning',
    backgroundColorLight: 'bg-warning/10',
    borderColor: 'border-warning',
  },
  error: {
    backgroundColor: 'bg-error',
    backgroundColorLight: 'bg-error/10',
    borderColor: 'border-error',
  },
  info: {
    backgroundColor: 'bg-info',
    backgroundColorLight: 'bg-info/10',
    borderColor: 'border-info',
  },
};
const BlockquoteCustom = ({
  variants = 'primary',
  title,
  content,
  contentClassName,
}: BlockquoteCustomProps) => {
  const styles = variantStyles[variants];

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-2">
          <div className={cn('h-6 w-1 rounded-full', styles.backgroundColor)}></div>
          <Label className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</Label>
        </div>
      )}
      <div
        className={cn(
          'rounded-lg border-l-4 p-4',
          styles.borderColor,
          styles.backgroundColorLight,
          contentClassName
        )}
      >
        <div className="leading-relaxed text-gray-700 dark:text-gray-200">{content}</div>
      </div>
    </div>
  );
};

export default memo(BlockquoteCustom);
