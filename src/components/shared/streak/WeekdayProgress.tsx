import React, { memo } from 'react';

import { cn } from '@/lib/utils';

import { Check } from 'lucide-react';

interface WeekdayProgressProps {
  completedDays?: boolean[];
  dayNumbers?: number[];
}

const WeekdayProgress = ({ completedDays, dayNumbers }: WeekdayProgressProps) => {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="flex gap-2">
      {weekDays.map((day, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">{day}</span>
          {completedDays?.[index] ? (
            <div className="from-primary/20 via-primary/70 to-primary flex size-9 items-center justify-center rounded-full bg-gradient-to-br backdrop-blur-sm">
              <Check className="text-primary-foreground h-5 w-5" />
            </div>
          ) : (
            <div
              className={cn(
                'text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm font-semibold',
                new Date().getDate() === dayNumbers?.[index] ? 'bg-primary border text-white' : ''
              )}
            >
              {dayNumbers?.[index]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default memo(WeekdayProgress);
