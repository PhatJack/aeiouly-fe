'use client';

import React, { memo, useEffect, useRef, useState } from 'react';

import MessageContainer from '@/components/shared/chat/MessageContainer';
import MessageInput from '@/components/shared/chat/MessageInput';
import MessageItem from '@/components/shared/chat/MessageItem';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/use-recorder';
import { SpeakingChatMessageResponseSchema } from '@/lib/schema/speaking-session.schema';
import { cn } from '@/lib/utils';
import {
  useGetSpeakingChatHistoryQuery,
  useSendSpeakingChatMessageMutation,
  useSpeechToTextMutation,
} from '@/services/speaking-session';

import { Mic, Square } from 'lucide-react';
import { toast } from 'sonner';

interface ChatSectionProps {
  sessionId: number;
  className?: string;
}

const ChatSection = ({ sessionId, className }: ChatSectionProps) => {
  const { data: chatHistory } = useGetSpeakingChatHistoryQuery(sessionId, {
    refetchOnWindowFocus: false,
  });

  const [localMessages, setLocalMessages] = useState<SpeakingChatMessageResponseSchema[]>([]);
  const sendChatMutation = useSendSpeakingChatMessageMutation();
  const speechToTextMutation = useSpeechToTextMutation();
  const [historyMessageIds, setHistoryMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Recorder hook
  const {
    startRecording,
    stopRecording,
    isRecording,
    audioBlob,
    resetRecorder,
    resetStream,
    stream,
    recorderRef,
  } = useRecorder();

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      setLocalMessages(chatHistory);
      setHistoryMessageIds(new Set(chatHistory.map((m) => `${m.session_id}_${m.role}_${m.id}`)));
    }
  }, [chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  const handleSendTextMessage = async (content: string) => {
    if (!content.trim()) return;

    const optimisticUserMessage: SpeakingChatMessageResponseSchema = {
      id: Date.now(),
      session_id: sessionId,
      role: 'user',
      content: content.trim(),
      is_audio: false,
      audio_url: null,
      translation_sentence: null,
      created_at: new Date().toISOString(),
    };

    setLocalMessages((prev) => [...prev, optimisticUserMessage]);
    sendChatMutation
      .mutateAsync({ sessionId, message: { content: content.trim() } })
      .then((res) => setLocalMessages((prev) => [...prev, res]));
  };

  useEffect(() => {
    const sendAudio = async () => {
      try {
        if (!audioBlob) return;

        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });

        const result = await speechToTextMutation.mutateAsync({
          audioFile: file,
          isSave: true,
          autoDetect: true,
        });
        resetRecorder();
        resetStream();

        const res = await sendChatMutation.mutateAsync({
          sessionId,
          message: { content: result.text },
          audioFile: file,
        });
        setLocalMessages((prev) => [...prev, res]);
      } catch (error) {
        toast.error('Không thể nhận dạng giọng nói. Vui lòng thử lại.');
      } finally {
        resetRecorder();
        resetStream();
      }
    };

    sendAudio();
  }, [audioBlob]);

  return (
    <div
      className={cn(
        'border-border/50 dark:bg-background flex flex-col rounded-2xl border bg-gray-50 p-4',
        className
      )}
    >
      {/* Messages Container */}
      <MessageContainer
        messages={localMessages as any}
        historyMessageIds={historyMessageIds}
        className="mb-4 flex-1"
      >
        {sendChatMutation.isPending && (
          <MessageItem
            content="Đang suy nghĩ..."
            senderRole="assistant"
            index={-1}
            isLoading={true}
          />
        )}
        {speechToTextMutation.isPending && (
          <MessageItem
            content="Đang phân tích âm thanh..."
            senderRole="user"
            index={-1}
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>

      <MessageInput
        onSendMessage={handleSendTextMessage}
        disabled={sendChatMutation.isPending}
        placeholder="Nhập tin nhắn hoặc dùng mic để nói..."
        showAudioButton
        isRecording={isRecording}
        onAudioClick={() => (isRecording ? stopRecording() : startRecording())}
        recorderStream={stream}
        mediaRecorderRef={recorderRef}
      />
    </div>
  );
};

export default memo(ChatSection);
