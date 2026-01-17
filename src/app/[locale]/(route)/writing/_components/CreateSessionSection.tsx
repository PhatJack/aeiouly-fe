'use client';

import React, { useRef } from 'react';

import { useTranslations } from 'next-intl';

import TopicInsertForm from '@/components/app/topic/TopicInsertForm';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';

import { Edit3 } from 'lucide-react';

interface CreateSessionSectionProps {
  selectedTopic?: WritingSessionCreateSchema;
}

const CreateSessionSection: React.FC<CreateSessionSectionProps> = ({ selectedTopic }) => {
  const t = useTranslations('writing');
  const formRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={formRef} className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
          <Edit3 className="text-primary size-5" />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold">{t('createSession.title')}</h2>
          <p className="text-muted-foreground text-sm">{t('createSession.description')}</p>
        </div>
      </div>
      <TopicInsertForm values={selectedTopic} />
    </div>
  );
};

export default CreateSessionSection;
