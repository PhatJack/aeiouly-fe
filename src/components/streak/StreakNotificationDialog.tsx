'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { Award, Flame, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface StreakMessage {
  current_streak: number;
  longest_streak: number;
  message: string;
  timestamp: string;
}

export const StreakNotificationDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [streakData, setStreakData] = useState<StreakMessage | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleWebSocketMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail;

      // Check if this is a streak message
      if (data && typeof data === 'object' && 'current_streak' in data && 'message' in data) {
        // Clear any existing timeout before setting a new one
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        setStreakData(data as StreakMessage);
        setIsOpen(true);

        // Auto-close after 5 seconds
        timeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 5000);
      }
    };

    window.addEventListener('ws:message', handleWebSocketMessage);

    return () => {
      window.removeEventListener('ws:message', handleWebSocketMessage);
      // Clean up timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!streakData) return null;

  const isNewRecord = streakData.current_streak === streakData.longest_streak;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-md overflow-hidden border-none bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-0 dark:from-orange-950 dark:via-gray-900 dark:to-yellow-950">
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-800/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/30 blur-3xl dark:bg-yellow-800/20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 p-6">
          <AlertDialogHeader className="space-y-4">
            {/* Icon */}
            <motion.div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-yellow-500 shadow-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Flame className="h-10 w-10 text-white" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <AlertDialogTitle className="text-center text-2xl font-bold">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isNewRecord ? (
                  <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-yellow-400">
                    🏆 Kỷ lục mới!
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-yellow-400">
                    🎉 Streak tiếp tục!
                  </span>
                )}
              </motion.div>
            </AlertDialogTitle>

            {/* Description */}
            <AlertDialogDescription className="space-y-4 text-center">
              <motion.div
                className="text-base text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {streakData.message.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < streakData.message.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col items-center rounded-lg bg-white/50 p-3 shadow-sm backdrop-blur-sm dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {streakData.current_streak}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Hiện tại</span>
                </div>

                <div className="flex flex-col items-center rounded-lg bg-white/50 p-3 shadow-sm backdrop-blur-sm dark:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {streakData.longest_streak}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Cao nhất</span>
                </div>
              </motion.div>

              {/* New Record Badge */}
              {isNewRecord && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Badge className="mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                    <Award className="mr-1 h-3 w-3" />
                    Kỷ lục mới của bạn!
                  </Badge>
                </motion.div>
              )}

              {/* Encouragement Message */}
              <motion.p
                className="text-sm text-gray-600 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Tiếp tục phát huy nhé! 💪
              </motion.p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Confetti Effect */}
          <div className="pointer-events-none absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#f59e0b' : '#fb923c',
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                animate={{
                  y: [0, 500],
                  x: [0, Math.random() * 100 - 50],
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
