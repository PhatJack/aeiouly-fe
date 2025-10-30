import React from 'react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { VariantProps, cva } from 'class-variance-authority';

const tooltipVariants = cva(
  'max-w-48 text-center text-white p-2 rounded-md', // Base styles
  {
    variants: {
      variant: {
        default: 'bg-gray-800',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-emerald-600',
        danger: 'bg-destructive text-destructive-foreground',
        information: 'bg-cyan-600',
        warning: 'bg-amber-600',
        black: 'bg-black',
        white: 'bg-white text-black',
        accent: 'bg-accent text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface TooltipCustomProps extends VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const TooltipCustom = ({
  content,
  children,
  side = 'right',
  className,
  variant,
}: TooltipCustomProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className={cn(tooltipVariants({ variant }), className)} side={side}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipCustom;
