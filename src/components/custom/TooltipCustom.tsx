import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipCustomProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipCustom = ({ content, children, side = 'right' }: TooltipCustomProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="text-sm font-medium" side={side}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipCustom;
