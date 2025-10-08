'use client';

import React from 'react';

import BlockquoteCustom from '@/components/custom/BlockquoteCustom';
import MessageContainer from '@/components/shared/chat/MessageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecorder } from '@/hooks/use-recorder';
import { cn } from '@/lib/utils';

import { MessageCircleWarning, Mic, Pause } from 'lucide-react';

const OnionDetailPage = () => {
  const {
    stream,
    startRecording,
    stopRecording,
    isRecording,
    resetRecorder,
    resetStream,
    audioBlob,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
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

  const audioTrack = stream?.getAudioTracks()[0];
  const settings = audioTrack?.getSettings();

  const deviceOptions = devices.filter((device) => !!device.id);

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
      <div className="flex w-full flex-col rounded-xl border bg-gray-50 p-4 lg:w-2/5">
        {/* {audioBlob && <audio controls src={blobToAudio(audioBlob)} loop />} */}
        <div className="flex w-full items-center justify-between gap-2 border-b pb-4">
          {deviceOptions.length < 1 ? null : (
            <div className="invisible w-1/2 space-y-4 border-r pr-4 md:visible">
              <Label className="text-foreground">Thiết bị đầu vào</Label>
              <Select
                onValueChange={(e) => setSelectedDeviceId(e)}
                value={selectedDeviceId || settings?.deviceId || 'preferred'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="preferred">Thiết bị mặc định</SelectItem>
                  {deviceOptions.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="invisible w-1/2 space-y-4 border-r pl-4 md:visible">
            <Label className="text-foreground">Có lỗi xảy ra?</Label>
            <Button type="button" variant={'destructive'} className="w-full py-1">
              <MessageCircleWarning />
              Gửi báo cáo
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <BlockquoteCustom
            variants="info"
            title="Tình huống"
            content="Bạn là một nhân viên chăm sóc khách hàng. Hãy giúp khách hàng giải quyết các vấn đề về sản phẩm và dịch vụ của công ty một cách nhanh chóng và hiệu quả."
          />
          <BlockquoteCustom
            variants="primary"
            title="Nhiệm vụ"
            content="Bạn là một nhân viên chăm sóc khách hàng. Hãy giúp khách hàng giải quyết các vấn đề về sản phẩm và dịch vụ của công ty một cách nhanh chóng và hiệu quả."
          />
        </div>
      </div>
    </div>
  );
};

export default OnionDetailPage;
