'use client';

import React, { memo, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'nextjs-toploader/app';

import FinalEvaluation from '@/components/app/onion/FinalEvaluation';
import SessionCompleteDialog from '@/components/app/topic/SessionCompleteDialog';
import MessageContainer from '@/components/shared/chat/MessageContainer';
import MessageInput from '@/components/shared/chat/MessageInput';
import MessageItem from '@/components/shared/chat/MessageItem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SpeakingSessionContext } from '@/contexts/SpeakingSessionContext';
import { useSpeechContext } from '@/contexts/SpeechContext';
import { useRecorder } from '@/hooks/use-recorder';
import { SpeakingChatMessageResponseSchema } from '@/lib/schema/speaking-session.schema';
import { cn } from '@/lib/utils';
import {
  useGetSpeakingChatHistoryQuery,
  useGetSpeakingFinalEvaluationQuery,
  useSendSpeakingChatMessageMutation,
  useSpeechToTextMutation,
} from '@/services/speaking-session';

import { toast } from 'sonner';
import { useContextSelector } from 'use-context-selector';

interface ChatSectionProps {
  sessionId: number;
  className?: string;
}

const ChatSection = ({ sessionId, className }: ChatSectionProps) => {
  const router = useRouter();
  const { data: chatHistory } = useGetSpeakingChatHistoryQuery(sessionId, {
    refetchOnWindowFocus: false,
  });
  const handleSelectedSentenceIndex = useContextSelector(
    SpeakingSessionContext,
    (ctx) => ctx!.handleSelectedSentenceIndex
  );
  const { speak, setSelectedVoice, selectedVoice, voices } = useSpeechContext();
  const [localMessages, setLocalMessages] = useState<SpeakingChatMessageResponseSchema[]>([]);
  const { data: finalEvaluation, refetch: refetchFinalEvaluation } =
    useGetSpeakingFinalEvaluationQuery(sessionId, {
      refetchOnWindowFocus: false,
      enabled: false,
    });
  const sendChatMutation = useSendSpeakingChatMessageMutation();
  const speechToTextMutation = useSpeechToTextMutation();
  const [historyMessageIds, setHistoryMessageIds] = useState<Set<string>>(new Set());
  const selectedVoiceObject = useMemo(
    () => voices.find((v) => v.name === selectedVoice),
    [voices, selectedVoice]
  );
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

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
  }, [chatHistory, setSelectedVoice]);

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
      .then((res) => {
        handleSelectedSentenceIndex(res.id);
        setLocalMessages((prev) => [...prev, res]);
        speak({
          text: res.content,
          pitch: 1.4,
          voice: selectedVoiceObject,
          messageId: `message-${res.id}`,
        });
        if (res.session?.status === 'completed') {
          refetchFinalEvaluation();
        }
      });
  };

  useEffect(() => {
    const sendAudio = async () => {
      try {
        if (!audioBlob) return;

        const file = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });

        const result = await speechToTextMutation.mutateAsync(
          {
            audioFile: file,
            isSave: true,
            autoDetect: true,
          },
          {
            onSuccess: (data) => {
              const optimisticUserMessage: SpeakingChatMessageResponseSchema = {
                id: Date.now(),
                session_id: sessionId,
                role: 'user',
                content: data.text,
                is_audio: false,
                audio_url: data.audio_url,
                translation_sentence: null,
                created_at: new Date().toISOString(),
              };

              setLocalMessages((prev) => [...prev, optimisticUserMessage]);
            },
          }
        );

        const res = await sendChatMutation.mutateAsync(
          {
            sessionId,
            message: { content: result.text },
            audioFile: result.audio_url || '',
          },
          {
            onSuccess: (res) => {
              speak({
                text: res.content,
                pitch: 1.4,
                voice: selectedVoiceObject,
                messageId: `message-${res.id}`,
              });
              setLocalMessages((prev) => [...prev, res]);
              if (res.session?.status === 'completed') {
                refetchFinalEvaluation();
              }
            },
          }
        );
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
    <>
      <div
        className={cn(
          'border-border/50 dark:bg-background flex flex-col rounded-2xl border bg-gray-50 py-4',
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
        </MessageContainer>
        <div className="px-4">
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
      </div>
      <SessionCompleteDialog
        open={showSessionComplete}
        onOpenChange={setShowSessionComplete}
        onViewResult={() => {
          setShowSessionComplete(false);
          setShowEvaluation(true);
          refetchFinalEvaluation();
        }}
      />
      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          className="max-h-[90vh] max-w-3xl min-w-3xl overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Kết quả đánh giá</DialogTitle>
            <DialogDescription>Chi tiết kết quả phiên luyện nói của bạn</DialogDescription>
          </DialogHeader>
          {finalEvaluation && (
            <FinalEvaluation
              data={finalEvaluation}
              onClose={() => {
                setShowEvaluation(false);
                router.push('/onion');
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(ChatSection);
