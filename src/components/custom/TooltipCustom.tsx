import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipCustomProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

const TooltipCustom = ({ content, children }: TooltipCustomProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default TooltipCustom;
