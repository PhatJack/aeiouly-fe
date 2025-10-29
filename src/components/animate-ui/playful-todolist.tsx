'use client';

import * as React from 'react';

import { Label } from '@/components/ui/label';
import { SessionGoalsStatusSchema } from '@/lib/schema/session-goal.schema';
import { cn } from '@/lib/utils';

import { type Transition, motion } from 'motion/react';

import { Checkbox } from '../ui/checkbox';

interface CheckboxItem {
  id: number;
  label: string;
  status: SessionGoalsStatusSchema;
}

interface PlayfulTodolistProps {
  list?: CheckboxItem[];
  className?: string;
  onStatusChange?: (id: number, status: SessionGoalsStatusSchema) => void;
}

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
});

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 1, ease: 'easeInOut' },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 1,
  },
});

function PlayfulTodolist({ list, className, onStatusChange }: PlayfulTodolistProps) {
  if (!list || list.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-6 rounded-2xl bg-neutral-100 p-6 dark:bg-neutral-900', className)}>
      {list.map((item, idx) => (
        <div key={item.id} className="space-y-4">
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              checked={item.status === 'COMPLETED'}
              onCheckedChange={(val) => {
                const newStatus = val === true ? 'COMPLETED' : 'OPEN';
                onStatusChange?.(item.id, newStatus);
              }}
              id={`checkbox-${item.id}`}
            />
            <div className="relative inline-block">
              <Label
                htmlFor={`checkbox-${item.id}`}
                className={cn(item.status === 'COMPLETED' ? 'text-muted-foreground' : '')}
              >
                {item.label}
              </Label>
              <motion.svg
                width="340"
                height="32"
                viewBox="0 0 340 32"
                className="pointer-events-none absolute top-1/2 left-0 z-20 h-10 w-full -translate-y-1/2"
              >
                <motion.path
                  d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeMiterlimit={10}
                  fill="none"
                  initial={false}
                  animate={getPathAnimate(item.status === 'COMPLETED')}
                  transition={getPathTransition(item.status === 'COMPLETED')}
                  className="stroke-neutral-900 dark:stroke-neutral-100"
                />
              </motion.svg>
            </div>
          </div>
          {idx !== list.length - 1 && (
            <div className="border-t border-neutral-300 dark:border-neutral-700" />
          )}
        </div>
      ))}
    </div>
  );
}

export { PlayfulTodolist };
