'use client';

import React, { useRef } from 'react';

import TopicInsertForm from '@/components/app/topic/TopicInsertForm';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';

import { Edit3 } from 'lucide-react';

interface CreateSessionSectionProps {
  selectedTopic?: WritingSessionCreateSchema;
}

const CreateSessionSection: React.FC<CreateSessionSectionProps> = ({ selectedTopic }) => {
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={formRef} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
          <Edit3 className="text-primary size-5" />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold">Tạo phiên viết mới</h2>
          <p className="text-muted-foreground text-sm">
            Tùy chỉnh chủ đề và độ khó theo ý muốn của bạn
          </p>
        </div>
      </div>
      <TopicInsertForm values={selectedTopic} />
    </div>
  );
};

export default CreateSessionSection;
