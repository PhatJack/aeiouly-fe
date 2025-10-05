import { useRef, useState } from 'react';

import { useGetDevice } from './use-get-device';
import { useGetStream } from './use-get-stream';
import { useRecorderState } from './use-recorder-state';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null | undefined>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);

  const { devices, selectedDeviceId, setSelectedDeviceId } = useGetDevice();
  const { getStream } = useGetStream(selectedDeviceId);

  const startRecording = async () => {
    try {
      streamRef.current = await getStream();
      if (!streamRef.current) return;
      recorderRef.current = new MediaRecorder(streamRef.current);
      recorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting the recording:', error);
    }
  };

  const pauseRecording = () => {
    if (recorderRef.current) {
      setIsRecording(false);
      recorderRef.current.pause();
    }
  };

  const resumeRecording = () => {
    if (recorderRef.current) {
      setIsRecording(true);
      recorderRef.current.resume();
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;
    recorderRef.current.stop();
    setIsRecording(false);
    recorderRef.current.onstop = () => {};
    streamRef.current?.getTracks().forEach((t) => t.stop());
    recorderRef.current = null;

    resetRecorderState();
  };

  const { recorderState, resetRecorderState } = useRecorderState(isRecording);

  const resetRecorder = () => {
    recorderRef.current = null;
    setIsRecording(false);
  };

  const resetStream = () => {
    streamRef.current?.getAudioTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  return {
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    isRecording,
    recorderRef,
    recorderState,
    stream: streamRef.current,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    resetStream,
    resetRecorder,
  };
};
