import { useRef, useState } from 'react';

import { useGetDevice } from './use-get-device';
import { useGetStream } from './use-get-stream';
import { useRecorderState } from './use-recorder-state';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null | undefined>(null);

  // * state to hold the recorded audio blob
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);

  // * Create audio URL from stream
  const chunksRef = useRef<Blob[]>([]); // 👈 nơi lưu dữ liệu ghi

  // * Get all devices
  const { devices, selectedDeviceId, setSelectedDeviceId } = useGetDevice();

  // * Get stream from selected device
  const { getStream } = useGetStream(selectedDeviceId);

  const startRecording = async () => {
    try {
      streamRef.current = await getStream();
      if (!streamRef.current) return;
      recorderRef.current = new MediaRecorder(streamRef.current);
      recorderRef.current.start();
      chunksRef.current = []; // 👈 reset chunks khi bắt đầu ghi

      recorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data); // 👈 thêm dữ liệu mới vào chunk
        }
      };
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
    recorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob); // * save blob for playback or upload
    };
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
    audioBlob,
    stream: streamRef.current,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    resetStream,
    resetRecorder,
  };
};
