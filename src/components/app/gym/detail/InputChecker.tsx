import React, { JSX, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SentenceResponseSchema } from '@/lib/schema/listening-session.schema';
import { normalizeText } from '@/lib/utils';

import { CheckCircle2, TriangleAlert } from 'lucide-react';

import { computeWordDiff } from '../helpers/input-check';
import PronounCard from './PronounCard';
import TranslationCard from './TranslationCard';

type LastResultType = {
  result: Array<{
    tag: string;
    word: string;
    correctWord?: string;
    diffIndex?: number;
  }>;
  correct: string;
};

type Props = {
  sentence: SentenceResponseSchema;
  onNext?: () => void;
  isLoading?: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

const InputChecker = memo(({ sentence, onNext, isLoading, inputRef, containerRef }: Props) => {
  const [userText, setUserText] = useState('');
  const [lastResult, setLastResult] = useState<LastResultType | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);

  const checkExactMatch = useCallback(() => {
    if (!sentence || !userText?.trim()) return false;
    return normalizeText(sentence.text) === normalizeText(userText);
  }, [sentence, userText]);

  useEffect(() => {
    setUserText('');
    setLastResult(null);
    setIsSkipped(false);
    setIsExactMatch(false);
  }, [sentence.id]);

  const handleCheck = useCallback(() => {
    if (!isExactMatch) {
      const { result } = computeWordDiff(sentence.text, userText);
      setLastResult({ result, correct: sentence.text });
      setIsExactMatch(checkExactMatch());
    } else {
      onNext?.();
    }
  }, [sentence, userText, isExactMatch]);

  const handleSkip = useCallback(() => {
    const fullText = sentence.text;
    setUserText(fullText);
    setIsSkipped(true);
    setIsExactMatch(true);
  }, [sentence.text]);

  const handleNext = useCallback(() => onNext?.(), [onNext]);

  const handleReset = useCallback(() => {
    setUserText('');
    setLastResult(null);
    setIsSkipped(false);
    setIsExactMatch(false);
  }, []);

  const rendered = useMemo(() => {
    if (!lastResult) return null;
    const correctLine: JSX.Element[] = [];

    lastResult.result.forEach((t: any, idx: number) => {
      if (t.tag === 'correct') {
        correctLine.push(<span key={idx}>{t.word} </span>);
      } else if (t.tag === 'typo') {
        const word = t.correctWord.split('').map((c: string, i: number) => {
          if (i === t.diffIndex) return <u key={i}>{c}</u>;
          return c;
        });
        correctLine.push(
          <span key={idx} className="font-bold text-green-600">
            {word}{' '}
          </span>
        );
      } else if (t.tag === 'missing') {
        correctLine.push(
          <span key={idx} className="font-bold text-green-600">
            <span className="underline">{t.word.charAt(0)}</span>
            {t.word.slice(1) + ' '}
          </span>
        );
      } else if (t.tag === 'asterisk') {
        correctLine.push(<span key={idx}>{t.word} </span>);
      }
    });

    return { correctLine };
  }, [lastResult]);

  return (
    <Card className="p-4">
      <div ref={containerRef} className="space-y-4">
        <div className="relative">
          <Textarea
            ref={inputRef}
            placeholder="Nhập câu bạn nghe được..."
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            className="min-h-[120px] resize-none md:text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCheck();
              }
            }}
          />
        </div>

        <div className="flex gap-4">
          {isExactMatch ? (
            <div className="flex w-full justify-end gap-4">
              <Button
                type="button"
                onClick={handleReset}
                className="dark:bg-input"
                size={'lg'}
                variant={'outline'}
              >
                Làm lại
              </Button>
              <Button size="lg" type="button" onClick={handleNext}>
                {isLoading ? 'Đang tải...' : 'Tiếp theo'}
              </Button>
            </div>
          ) : (
            <>
              <Button size="lg" type="button" onClick={handleCheck}>
                Kiểm tra
              </Button>
              <Button size="lg" type="button" variant="outline" onClick={handleSkip}>
                Bỏ qua
              </Button>
            </>
          )}
        </div>

        {lastResult && rendered && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {userText && isExactMatch ? (
                <>
                  <CheckCircle2 className="text-green-600" />
                  <span className="font-semibold text-green-500">Chính xác</span>
                </>
              ) : (
                <>
                  <TriangleAlert className="text-yellow-600" />
                  <span className="font-semibold text-yellow-500">Chưa chính xác</span>
                </>
              )}
            </div>
            <Card className="rounded-lg border bg-white text-xl text-black">
              <CardContent>
                <p>{rendered?.correctLine}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {(isSkipped || isExactMatch) && (
          <>
            <TranslationCard translation={sentence.translation || ''} />
            <PronounCard words={sentence.text.split(' ')} />
          </>
        )}
      </div>
    </Card>
  );
});
InputChecker.displayName = 'InputChecker';
export default InputChecker;
