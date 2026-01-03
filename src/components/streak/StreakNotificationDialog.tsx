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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Award, Flame, Trophy, Zap } from 'lucide-react';
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

  useEffect(() => {
    const handleWebSocketMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail;

      // Check if this is a streak message
      if (data && typeof data === 'object' && 'current_streak' in data && 'message' in data) {
        setStreakData(data as StreakMessage);
        setIsOpen(true);
      }
    };

    window.addEventListener('ws:message', handleWebSocketMessage);

    return () => {
      window.removeEventListener('ws:message', handleWebSocketMessage);
    };
  }, []);

  if (!streakData) return null;

  const isNewRecord = streakData.current_streak === streakData.longest_streak;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="from-warning/10 via-warning/5 to-success/10 border-warning max-w-lg overflow-hidden border-2 bg-gradient-to-br p-0 shadow-2xl">
        {/* Animated Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="bg-warning/30 absolute -top-20 -right-20 h-60 w-60 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-success/30 absolute -bottom-20 -left-20 h-60 w-60 rounded-full blur-2xl"
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.7, 0.4, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 p-8">
          <AlertDialogHeader className="space-y-6">
            {/* Icon */}
            <motion.div
              className="from-warning to-success mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 20,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {isNewRecord ? (
                  <Trophy className="h-12 w-12 text-white" />
                ) : (
                  <Flame className="h-12 w-12 text-white" />
                )}
              </motion.div>
            </motion.div>

            {/* Title */}
            <AlertDialogTitle className="text-center text-3xl font-extrabold">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isNewRecord ? (
                  <span className="from-warning to-success bg-gradient-to-r bg-clip-text text-transparent">
                    🏆 Kỷ lục mới!
                  </span>
                ) : (
                  <span className="from-warning to-success bg-gradient-to-r bg-clip-text text-transparent">
                    🔥 Streak tiếp tục!
                  </span>
                )}
              </motion.div>
            </AlertDialogTitle>

            {/* Description */}
            <AlertDialogDescription className="space-y-6 text-center">
              <motion.div
                className="text-foreground text-lg leading-relaxed"
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
                className="flex items-center justify-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex flex-col items-center rounded-xl bg-white/20 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Flame className="text-warning h-6 w-6" />
                    <span className="text-warning-foreground text-3xl font-bold">
                      {streakData.current_streak}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">Hiện tại</span>
                </div>

                <div className="flex flex-col items-center rounded-xl bg-white/20 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <Trophy className="text-success h-6 w-6" />
                    <span className="text-success-foreground text-3xl font-bold">
                      {streakData.longest_streak}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm">Cao nhất</span>
                </div>
              </motion.div>

              {/* New Record Badge */}
              {isNewRecord && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <Badge className="from-warning to-success mx-auto bg-gradient-to-r text-white shadow-md">
                    <Award className="mr-2 h-4 w-4" />
                    Kỷ lục mới của bạn!
                  </Badge>
                </motion.div>
              )}

              {/* Encouragement Message */}
              <motion.p
                className="text-muted-foreground text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Tiếp tục phát huy nhé! 💪
              </motion.p>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  onClick={() => setIsOpen(false)}
                  className="from-warning to-success w-full bg-gradient-to-r text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Đóng
                </Button>
              </motion.div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Enhanced Confetti Effect */}
          <div className="pointer-events-none absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'absolute h-3 w-3 rounded-full',
                  i % 3 === 0 ? 'bg-warning' : i % 3 === 1 ? 'bg-success' : 'bg-warning'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-20%',
                }}
                animate={{
                  y: [0, 600],
                  x: [0, Math.random() * 200 - 100],
                  rotate: [0, Math.random() * 720],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 1,
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
