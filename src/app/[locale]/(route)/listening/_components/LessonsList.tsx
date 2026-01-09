'use client';

import React from 'react';

import ListeningLessonCard from '@/components/app/gym/ListeningLessonCard';
import { LessonResponseSchema } from '@/lib/schema/listening-session.schema';

interface LessonsListProps {
  lessons: LessonResponseSchema[];
  onLessonClick: (lessonId: number) => void;
}

const LessonsList = ({ lessons, onLessonClick }: LessonsListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {lessons.map((lesson) => (
        <ListeningLessonCard
          key={lesson.id}
          lesson={lesson}
          onClick={() => onLessonClick(lesson.id)}
        />
      ))}
    </div>
  );
};

export default LessonsList;
