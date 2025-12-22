'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import {
  type MotionValue,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

/* ---------------- Timeline ---------------- */

const Timeline = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  ({ className, children, ...props }, ref) => {
    const containerRef = React.useRef<HTMLOListElement | null>(null);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start 80%', 'end 20%'],
    });

    const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 120,
      damping: 25,
    });

    const enhancedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      return React.cloneElement(child as React.ReactElement<any>, {
        __scrollprogress: smoothProgress,
      });
    });

    return (
      <ol
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="timeline"
        className={cn('relative flex flex-col', className)}
        {...props}
      >
        {enhancedChildren}
      </ol>
    );
  }
);
Timeline.displayName = 'Timeline';

/* ---------------- TimelineItem ---------------- */

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & {
    __scrollprogress?: MotionValue<number>;
  }
>(({ className, children, __scrollprogress, ...props }, ref) => {
  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child as React.ReactElement<any>, {
      __scrollprogress,
    });
  });

  return (
    <li
      ref={ref}
      data-slot="timeline-item"
      className={cn('relative flex gap-4 pb-8 last:pb-0', className)}
      {...props}
    >
      {enhancedChildren}
    </li>
  );
});
TimelineItem.displayName = 'TimelineItem';

/* ---------------- TimelineDot ---------------- */
const TimelineDot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
    asChild?: boolean;
  }
>(({ className, variant = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      data-slot="timeline-dot"
      className={cn(
        'relative z-10 shrink-0 rounded-full',
        !asChild &&
          cn('bg-background size-4 border-2', {
            'border-border': variant === 'default',
            'border-primary bg-primary': variant === 'primary',
            'border-success bg-success': variant === 'success',
            'border-warning bg-warning': variant === 'warning',
            'border-destructive bg-destructive': variant === 'destructive',
          }),
        className
      )}
      {...props}
    />
  );
});

TimelineDot.displayName = 'TimelineDot';

/* ---------------- TimelineConnector ---------------- */
/* ---------------- TimelineConnector ---------------- */

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    animationConnection?: boolean;
    __scrollprogress?: MotionValue<number>;
  }
>(({ className, animationConnection = false, __scrollprogress, ...props }, ref) => {
  // 1. Create a fallback MotionValue so hooks don't break if prop is missing
  const defaultProgress = useMotionValue(0);
  const progress = __scrollprogress ?? defaultProgress;

  // 2. Call useTransform unconditionally (Always runs)
  const height = useTransform(
    progress,
    [0, 1],
    animationConnection ? ['0%', '100%'] : ['0%', '0%']
  );

  // 3. Conditional Logic / Rendering
  if (!animationConnection || !__scrollprogress) {
    return (
      <div
        ref={ref}
        data-slot="timeline-connector"
        className={cn('bg-border absolute top-4 left-2 h-full w-px -translate-x-1/2', className)}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      data-slot="timeline-connector"
      className={cn('absolute top-4 left-2 h-full w-px -translate-x-1/2', className)}
      {...props}
    >
      <div className="bg-border absolute inset-0" />
      <motion.div
        style={{ height }}
        className="from-primary via-primary/80 to-primary absolute inset-x-0 top-0 bg-gradient-to-b"
      />
    </div>
  );
});
TimelineConnector.displayName = 'TimelineConnector';

/* ---------------- Content ---------------- */

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="timeline-content"
      className={cn('flex flex-1 flex-col gap-1', className)}
      {...props}
    />
  )
);
TimelineContent.displayName = 'TimelineContent';

const TimelineHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="timeline-heading"
    className={cn('leading-none font-semibold', className)}
    {...props}
  />
));
TimelineHeading.displayName = 'TimelineHeading';

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="timeline-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
TimelineDescription.displayName = 'TimelineDescription';

const TimelineTime = React.forwardRef<HTMLTimeElement, React.TimeHTMLAttributes<HTMLTimeElement>>(
  ({ className, ...props }, ref) => (
    <time
      ref={ref}
      data-slot="timeline-time"
      className={cn('text-muted-foreground text-xs', className)}
      {...props}
    />
  )
);
TimelineTime.displayName = 'TimelineTime';

/* ---------------- Exports ---------------- */

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
  TimelineTime,
};
