import React, { memo } from 'react';

import { cn } from '@/lib/utils';

interface SettingHeaderProps {
  title: string;
  description: string;
  icon: React.ElementType; // ⬅ change from string to component
  className?: string;
}

const SettingHeader = ({ title, description, icon: Icon, className }: SettingHeaderProps) => {
  return (
    <div className={cn('border-border border-b p-4', className)}>
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon className="size-5" />
        </div>

        <div>
          <h2 className="text-foreground text-xl font-semibold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default memo(SettingHeader);
