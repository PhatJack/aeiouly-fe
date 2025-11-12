import React, { memo } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string | number;
  isLive?: boolean;
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon: string;
  iconAlt?: string;
  ringColor?: string;
  stats?: StatItem[];
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  iconAlt = 'Icon',
  ringColor = 'ring-blue-600',
  stats,
  className,
}) => {
  return (
    <div className={cn('border-b', className)}>
      <div className="mb-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="group relative">
            <div
              className={cn(
                'bg-background dark:bg-card/50 dark:ring-offset-background relative flex h-20 w-20 items-center justify-center rounded-2xl ring-2 transition-all dark:shadow-lg dark:ring-offset-2',
                ringColor
              )}
            >
              <div className="relative size-10">
                <Image src={icon} alt={iconAlt} fill quality={100} />
              </div>
            </div>
          </div>

          {/* Title, Description and Stats */}
          <div className="flex-1 space-y-2">
            <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-4xl leading-snug font-bold tracking-tight text-transparent dark:from-white dark:to-gray-300">
              {title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed dark:text-gray-400">
              {description}
            </p>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm">
                {stats.map((stat, index) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center gap-2">
                      {stat.isLive && (
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50 dark:bg-green-400 dark:shadow-green-400/50" />
                      )}
                      <span className="text-muted-foreground dark:text-gray-400">
                        <span className="text-foreground font-semibold dark:text-white">
                          {stat.value}
                        </span>{' '}
                        {stat.label}
                      </span>
                    </div>
                    {index < stats.length - 1 && (
                      <div className="bg-border dark:bg-border/50 h-4 w-px" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PageHeader);
