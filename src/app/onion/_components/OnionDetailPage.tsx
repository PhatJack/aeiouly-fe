'use client';

import React, { useEffect, useState } from 'react';

import { useRecorder } from '@/hooks/use-recorder';

const OnionDetailPage = () => {
  const {
    stream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    recorderRef,
    recorderState,
    isRecording,
    resetRecorder,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    resetStream,
  } = useRecorder();

  const handleStart = () => {
    startRecording();
  };

  const handleResume = () => {
    resumeRecording();
  };

  const handlePause = () => {
    pauseRecording();
  };
  return (
    <div className="w-full">
      <div className="w-full lg:w-3/5"></div>
      <div className="w-full lg:w-2/5"></div>
    </div>
  );
};

export default OnionDetailPage;
