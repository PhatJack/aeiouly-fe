'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const THRESHOLD = 300;

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > THRESHOLD);
      const p = Math.min(y / THRESHOLD, 1);
      setProgress(p);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-to-top"
          initial={{ opacity: 0, y: 60, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 60, scale: 0.5, rotate: 180 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="Scroll to top"
          className="group fixed right-5 bottom-24 z-50"
        >
          <motion.div
            className="border-border/50 bg-background/80 relative flex size-14 items-center justify-center rounded-full border shadow-lg backdrop-blur-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: isHovered ? -4 : [0, -6, 0],
            }}
            transition={
              isHovered
                ? { type: 'spring', stiffness: 400, damping: 20 }
                : { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }
            }
          >
            {/* Progress circle */}
            <svg
              className="absolute inset-0 h-14 w-14 -rotate-90"
              viewBox="0 0 56 56"
              fill="none"
              aria-hidden
            >
              <circle
                cx="28"
                cy="28"
                r="25"
                stroke="currentColor"
                strokeWidth="2"
                className="text-border/30"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 25}
                className="text-foreground"
                initial={{ strokeDashoffset: 2 * Math.PI * 25 }}
                animate={{
                  strokeDashoffset: 2 * Math.PI * 25 * (1 - progress),
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              />
            </svg>

            <motion.div
              className="relative z-10"
              animate={{
                y: isHovered ? -3 : 0,
                rotate: isHovered ? 0 : [0, -10, 10, 0],
              }}
              transition={
                isHovered
                  ? { type: 'spring', stiffness: 500, damping: 15 }
                  : { duration: 0.5, delay: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }
              }
            >
              <ChevronUp className="text-foreground h-6 w-6" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
