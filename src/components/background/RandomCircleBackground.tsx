import React, { useMemo, CSSProperties } from "react";

interface RandomCirclesBackgroundProps {
  circleCount?: number;
}

const RandomCirclesBackground: React.FC<RandomCirclesBackgroundProps> = ({ circleCount = 6 }) => {
  const circles = useMemo(() => {
    const circleStyles: CSSProperties[] = [];

    for (let i = 0; i < circleCount; i++) {
      const size = Math.floor(Math.random() * 150) + 80; // random 80–230px
      const top = Math.random() * 100; // random top (0–100%)
      const left = Math.random() * 100; // random left (0–100%)

      circleStyles.push({
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        top: `${top}%`,
        left: `${left}%`,
      });
    }

    return circleStyles;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {circles.map((style, index) => (
        <div
          key={index}
          style={style}
          className="bg-gray-50/30 shadow-[0_0_0px_60px_rgba(255,255,255,0.05),0_0_0px_120px_rgba(255,255,255,0.1)] rounded-full"
        />
      ))}
    </div>
  );
};

export default RandomCirclesBackground;
