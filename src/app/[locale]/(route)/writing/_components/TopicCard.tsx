'use client';

import React from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { WritingSessionCreateSchema } from '@/lib/schema/writing-session.schema';
import { cn } from '@/lib/utils';

import { BookOpen, Hash } from 'lucide-react';

interface TopicCardProps {
  topic: string;
  level: WritingSessionCreateSchema['level'];
  total_sentences: number;
  image: string;
  onClick: () => void;
}

const levelColors: Record<WritingSessionCreateSchema['level'], string> = {
  A1: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
  A2: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  B1: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
  B2: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
  C1: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700',
  C2: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
};

const TopicCard: React.FC<TopicCardProps> = ({ topic, level, total_sentences, image, onClick }) => {
  const t = useTranslations('writing');
  return (
    <div
      onClick={onClick}
      className={cn(
        'group border-border/50 relative cursor-pointer overflow-hidden rounded-xl border-2',
        'from-background via-background/95 to-muted/30 bg-gradient-to-br',
        'transition-all duration-300 ease-out',
        'hover:border-primary/50 hover:scale-[1.03]',
        'active:scale-[0.98]'
      )}
    >
      {/* Background Gradient Effect */}
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-5">
        {/* Header with Image */}
        <div className="mb-4 flex items-start justify-between">
          <div className="bg-muted/50 relative size-16 shrink-0 overflow-hidden rounded-lg p-2">
            <Image
              fill
              alt={topic}
              src={image}
              className="object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <Badge variant="outline" className={cn('ml-2 border font-semibold', levelColors[level])}>
            {level}
          </Badge>
        </div>

        {/* Topic Title */}
        <div className="flex items-center justify-between">
          <h3 className="text-foreground group-hover:text-primary mb-3 text-lg leading-tight font-bold transition-colors duration-200">
            {topic}
          </h3>
          <div className="flex items-center gap-0.5">
            <Hash className="size-4" />
            <span className="font-medium">
              {t('topicCard.sentences', { count: total_sentences })}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="from-primary via-secondary to-accent absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

export default TopicCard;
