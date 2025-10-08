'use client';

import React, { ReactNode, useEffect, useState } from 'react';

import TooltipCustom from '@/components/custom/TooltipCustom';
import MessageContainer from '@/components/shared/chat/MessageContainer';
import MessageInput from '@/components/shared/chat/MessageInput';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/use-recorder';
import { RecorderState } from '@/hooks/use-recorder-state';
import { blobToAudio, cn } from '@/lib/utils';

import { Mic, Pause } from 'lucide-react';

const OnionDetailPage = () => {
  const {
    stream,
    startRecording,
    stopRecording,
    recorderRef,
    recorderState,
    isRecording,
    resetRecorder,
    resetStream,
    audioBlob,
  } = useRecorder();

  const handleStart = () => {
    startRecording();
  };

  const handleStop = () => {
    console.log(stream);
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
            'Be kind to yourself 💖',
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
      <div className="flex w-full flex-col rounded-xl border bg-gray-50 p-4 lg:w-2/5">
        <div className="mb-4">
          <h3 className="mb-2 text-lg font-semibold">Recording Status</h3>
          <p className="text-sm text-gray-600">
            {isRecording ? '🔴 Recording...' : '⭕ Not recording'}
          </p>
          {audioBlob && <audio controls src={blobToAudio(audioBlob)} loop />}
        </div>
      </div>
    </div>
  );
};

export default OnionDetailPage;
