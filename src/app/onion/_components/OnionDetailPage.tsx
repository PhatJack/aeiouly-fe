'use client';

import React from 'react';

import DetailRightPanel from '@/components/app/onion/DetailRightPanel';
import MessageContainer from '@/components/shared/chat/MessageContainer';
import { useRecorder } from '@/hooks/use-recorder';
import { cn } from '@/lib/utils';

import { Mic, Pause } from 'lucide-react';

const OnionDetailPage = () => {
  const {
    stream,
    startRecording,
    stopRecording,
    isRecording,
    resetRecorder,
    resetStream,
    audioBlob,
  } = useRecorder();

  const handleStart = () => {
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
    resetRecorder();
    resetStream();
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] w-full gap-6">
      <div className="relative flex size-full flex-col lg:w-3/5">
        <MessageContainer
          messages={[
            'Hello there 👋',
            'How’s it going?',
            'What a great day!',
            'Don’t forget to smile 😊',
            'Keep pushing forward 💪',
            'You’ve got this!',
            'Stay positive 🌈',
            'Let’s make today amazing!',
            'Never give up 🚀',
            'Be kind to yourself 💖',
            'Keep pushing forward 💪',
            'You’ve got this!',
            'Stay positive 🌈',
            'Let’s make today amazing!',
            'Never give up 🚀',
            'Be kind to yourself. And remember to take breaks!. Also, drink water!.It’s draining!. Focus on your goals and dreams!. You can achieve anything you set your mind to!. Believe in yourself!. You are capable of amazing things!. And remember to be grateful!. Gratitude brings happiness!. So count your blessings every day!. Life is a gift, cherish it!. Make the most of every moment!. Live, love, laugh! 💖',
            'Be kind to yourself 💖',
            'Keep pushing forward 💪',
            'You’ve got this!',
            'Stay positive 🌈',
            'Let’s make today amazing!',
            'Never give up 🚀',
            'Be kind to yourself 💖',
          ]}
          className="border pb-20"
        />
        <div className="absolute -bottom-9 left-1/2 z-50 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 rounded-b-xl border-t bg-gray-50 py-2">
          <button
            type="button"
            className={cn(
              'bg-primary hover:bg-primary/70 flex size-14 cursor-pointer items-center justify-center rounded-full text-white transition-all',
              isRecording ? 'bg-red-600 hover:bg-red-700' : ''
            )}
            onClick={isRecording ? handleStop : handleStart}
          >
            {isRecording ? <Pause size={26} /> : <Mic size={26} />}
          </button>
        </div>
      </div>
      <div className="w-full lg:w-2/5">
        <DetailRightPanel />
      </div>
    </div>
  );
};

export default OnionDetailPage;
