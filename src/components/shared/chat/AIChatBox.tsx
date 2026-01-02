'use client';

import React, { useCallback, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';

import { motion } from 'motion/react';

import AIChatBoxScreen from './AIChatBoxScreen';

const AIChatBox = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const shouldHide = useMemo(() => {
    return (
      /^\/writing\/\d+$/.test(pathname) ||
      /^\/reading\/\d+$/.test(pathname) ||
      /^\/speaking\/\d+$/.test(pathname) ||
      /^\/listening\/\d+$/.test(pathname) ||
      /^\/admin(\/.*)?$/.test(pathname)
    );
  }, [pathname]);
  if (shouldHide) return null;

  return (
    <div className="fixed right-0 bottom-0 z-50 sm:right-4 sm:bottom-4">
      {!isOpen && (
        <motion.div
          initial={{ y: 30, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative size-fit"
        >
          <TooltipCustom variant="information" content="Ho Ho Ho! Cần giúp gì không nhỉ?">
            <Button
              onClick={toggleChatBox}
              variant="ghost"
              className="relative size-16 overflow-hidden p-0 hover:bg-transparent dark:hover:bg-transparent"
            >
              <Image src="/catbox.png" alt="AI Icon" fill />
            </Button>
          </TooltipCustom>
        </motion.div>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark:bg-background relative z-50 mt-2 flex h-[95dvh] w-screen flex-col rounded-lg border bg-white p-4 shadow-lg sm:h-[34rem] sm:w-[28rem]"
        >
          <AIChatBoxScreen setIsOpen={setIsOpen} />
        </motion.div>
      )}

      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur sm:hidden" />}
    </div>
  );
};

export default AIChatBox;
