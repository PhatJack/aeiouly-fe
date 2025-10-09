// WaveAnimation.tsx
import React, { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

interface WaveAnimationProps {
  className?: string;
  /** Base color of the wave (default: white) */
  color?: string;
  speed?: number;
}

export const WaveAnimation: React.FC<WaveAnimationProps> = ({
  className,
  color = '#ffffff',
  speed = 25,
}) => {
  return (
    <div className={cn('absolute bottom-0 left-0 h-3/4 w-full overflow-hidden', className)}>
      <svg
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18 
               58-18 88-18 58 18 88 18v44h-352z"
          />
        </defs>
        <g
          className={cn('parallax')}
          style={{ '--move-forever-duration': `${speed}s` } as CSSProperties}
        >
          <use xlinkHref="#gentle-wave" x="48" y="0" fill={`${color}B3`} /> {/* 70% opacity */}
          <use xlinkHref="#gentle-wave" x="48" y="3" fill={`${color}80`} /> {/* 50% opacity */}
          <use xlinkHref="#gentle-wave" x="48" y="5" fill={`${color}4D`} /> {/* 30% opacity */}
          <use xlinkHref="#gentle-wave" x="48" y="7" fill={color} />
        </g>
      </svg>
    </div>
  );
};
