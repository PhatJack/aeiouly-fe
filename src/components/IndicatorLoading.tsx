import React from 'react';

interface IndicatorLoadingProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const IndicatorLoading: React.FC<IndicatorLoadingProps> = ({
  text = 'Thinking',
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`inline-block ${disabled ? 'text-gray-400' : 'animate-shine'} ${className} `}
      style={{
        backgroundImage: !disabled
          ? 'linear-gradient(120deg, rgba(75,85,99,1) 40%, rgba(255,255,255,0.9) 50%, rgba(75,85,99,1) 60%)'
          : undefined,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: !disabled ? 'text' : undefined,
        WebkitTextFillColor: !disabled ? 'transparent' : undefined,
        animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default IndicatorLoading;
