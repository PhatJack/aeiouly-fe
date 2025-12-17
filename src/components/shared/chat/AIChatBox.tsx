'use client';

import React, { useCallback, useState } from 'react';

import Image from 'next/image';

import TooltipCustom from '@/components/custom/TooltipCustom';
import { Button } from '@/components/ui/button';

import { motion } from 'motion/react';

import AIChatBoxScreen from './AIChatBoxScreen';

const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleChatBox = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!isOpen && (
        <motion.div
          initial={{ y: 30, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative"
        >
          <TooltipCustom variant={'information'} content="Ho Ho Ho! Cần giúp gì không nhỉ?">
            <Button
              onClick={toggleChatBox}
              variant="ghost"
              className="relative size-16 overflow-hidden p-0 hover:bg-transparent dark:hover:bg-transparent"
            >
              <Image src="/catbox.png" alt="AI Icon" fill />
            </Button>
          </TooltipCustom>
          {/* <Image src="/hat.png" alt="Noel hat" width={50} height={40} className="absolute -top-6 left-3 rotate-[-4deg]"/> */}
        </motion.div>
      )}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark:bg-background mt-2 hidden flex-col rounded-lg border bg-white p-4 shadow-lg sm:flex sm:h-[34rem] sm:w-[28rem]"
        >
          <AIChatBoxScreen setIsOpen={setIsOpen} />
        </motion.div>
      )}
    </div>
  );
};

export default AIChatBox;
