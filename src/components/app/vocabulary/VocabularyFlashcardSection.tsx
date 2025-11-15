'use client';

import React, { useState } from 'react';
import Markdown from 'react-markdown';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashcardResponseSchema } from '@/lib/schema/vocabulary.schema';

import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import remarkBreaks from 'remark-breaks';

interface VocabularyFlashcardSectionProps {
  cards: FlashcardResponseSchema[];
}

const VocabularyFlashcardSection = ({ cards }: VocabularyFlashcardSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setDirection('right');
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection('left');
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0,
      rotateY: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0,
      rotateY: 0,
    }),
  };

  return (
    <div className="space-y-8">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground dark:text-white">Flashcard từ vựng</CardTitle>
            <Badge variant="outline" className="text-base">
              {currentIndex + 1}/{totalCards}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm dark:text-gray-400">
            Nhấp vào thẻ để xem nghĩa
          </p>
        </CardHeader>
      </Card>

      {/* Flashcard */}
      <div className="relative flex min-h-[400px] items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute w-full"
          >
            <div
              className="perspective-1000 cursor-pointer"
              onClick={handleFlip}
              style={{ perspective: '1000px' }}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
                className="relative"
              >
                {/* Front of card (Word) */}
                <Card
                  className="dark:bg-card/50 dark:border-border/30 min-h-[400px] dark:backdrop-blur-sm"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
                    <div className="text-center">
                      <h2 className="text-foreground mb-4 text-5xl font-bold dark:text-white">
                        {currentCard.word}
                      </h2>
                      <p className="text-muted-foreground text-sm dark:text-gray-400">
                        Nhấp để xem nghĩa
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Back of card (Definition) */}
                <Card
                  className="absolute inset-0 min-h-[400px] overflow-y-auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <CardContent className="flex min-h-[400px] overflow-y-auto">
                    <div className="w-full">
                      <div className="text-foreground prose dark:prose-invert prose-p:!mb-0 overflow-y-auto dark:text-gray-300">
                        <Markdown remarkPlugins={[remarkBreaks]}>
                          {currentCard.definitions.replace(/\\n/g, '\n')}
                        </Markdown>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="h-5 w-5" />
              Trước
            </Button>

            <Button onClick={handleFlip} variant="secondary" size="lg" className="flex-1">
              <RotateCcw className="h-5 w-5" />
              Lật thẻ
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentIndex === totalCards - 1}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Tiếp
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VocabularyFlashcardSection;
