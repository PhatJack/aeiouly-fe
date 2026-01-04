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
      <AlertDialogContent className="from-background via-card to-muted max-w-md overflow-hidden border-0 bg-gradient-to-br p-0 shadow-2xl">
        {/* Animated Background Orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="bg-primary absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="bg-secondary absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </div>

        <div className="relative z-10 p-8">
          <AlertDialogHeader className="space-y-5">
            {/* Icon */}
            <motion.div
              className="relative mx-auto"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
            >
              <div className="from-primary/40 to-secondary/40 absolute inset-0 animate-pulse rounded-full bg-gradient-to-r blur-xl" />
              <div className="from-primary to-secondary ring-background relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg ring-4">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {isNewRecord ? (
                    <Trophy className="h-10 w-10 text-white" />
                  ) : (
                    <Flame className="h-10 w-10 text-white" />
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <AlertDialogTitle className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <div className="text-3xl font-bold tracking-tight">
                  {isNewRecord ? (
                    <span className="from-primary via-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
                      Kỷ lục mới! 🏆
                    </span>
                  ) : (
                    <span className="from-primary via-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
                      Streak tiếp tục! 🔥
                    </span>
                  )}
                </div>
              </motion.div>
            </AlertDialogTitle>

            {/* Description */}
            <AlertDialogDescription slot="div" className="space-y-5 text-center">
              <motion.div
                className="text-foreground text-base leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
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
                className="flex items-stretch justify-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="border-border bg-card flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Flame className="text-primary-foreground h-5 w-5" />
                  </div>
                  <span className="text-foreground text-3xl font-bold">
                    {streakData.current_streak}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">Hiện tại</span>
                </div>

                <div className="border-border bg-card flex flex-1 flex-col items-center gap-2 rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                  <div className="bg-secondary flex h-10 w-10 items-center justify-center rounded-full">
                    <Trophy className="text-secondary-foreground h-5 w-5" />
                  </div>
                  <span className="text-foreground text-3xl font-bold">
                    {streakData.longest_streak}
                  </span>
                  <span className="text-muted-foreground text-xs font-medium">Cao nhất</span>
                </div>
              </motion.div>

              {/* New Record Badge */}
              {isNewRecord && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, type: 'spring', stiffness: 200 }}
                  className="flex justify-center"
                >
                  <Badge className="border-primary bg-primary text-primary-foreground rounded-full border px-3 py-1 shadow-sm">
                    <Award className="mr-1.5 h-3.5 w-3.5" />
                    Kỷ lục mới của bạn!
                  </Badge>
                </motion.div>
              )}

              {/* Encouragement Message */}
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Tiếp tục phát huy nhé! 💪
              </motion.p>

              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Button
                  onClick={() => setIsOpen(false)}
                  className="from-primary to-secondary w-full bg-gradient-to-r text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                  size="lg"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Đóng
                </Button>
              </motion.div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Enhanced Confetti Effect */}
          <div className="pointer-events-none absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className={cn(
                  'absolute rounded-full',
                  i % 4 === 0
                    ? 'bg-primary h-2 w-2'
                    : i % 4 === 1
                      ? 'bg-secondary h-2.5 w-2.5'
                      : i % 4 === 2
                        ? 'bg-primary h-1.5 w-1.5'
                        : 'bg-secondary h-2 w-2'
                )}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                }}
                animate={{
                  y: [0, 500],
                  x: [0, (Math.random() - 0.5) * 150],
                  rotate: [0, Math.random() * 360],
                  opacity: [0.8, 0],
                  scale: [1, 0.3],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  delay: Math.random() * 0.8,
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
