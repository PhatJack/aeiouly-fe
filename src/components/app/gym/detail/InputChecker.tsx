import React, { JSX, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SentenceResponseSchema } from '@/lib/schema/listening-session.schema';

import { CheckCircle2, TriangleAlert } from 'lucide-react';

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
  onResult?: (result: { detailed: any }) => void;
  onNext?: () => void;
  isLoading?: boolean;
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[""„"«»]/g, '"')
    .replace(/[''`]/g, "'")
    .replace(/[^a-z0-9'\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const levenshtein = (a: string, b: string) => {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
};

const computeWordDiff = (correctRaw: string, userRaw: string) => {
  const correct = normalize(correctRaw);
  const user = normalize(userRaw);

  const correctWords = correct.split(' ');
  const userWords = user.split(' ');

  const result: Array<{
    tag: string;
    word: string;
    correctWord?: string;
    diffIndex?: number;
  }> = [];

  let errorFound = false;

  for (let i = 0; i < Math.max(correctWords.length, userWords.length); i++) {
    const c = correctWords[i] || '';
    const u = userWords[i] || '';

    if (errorFound) {
      if (c) result.push({ tag: 'asterisk', word: '*'.repeat(c.length) });
      continue;
    }

    if (c === u && c) {
      result.push({ tag: 'correct', word: c });
    } else if (!c && u) {
      result.push({ tag: 'extra', word: u });
      errorFound = true;
    } else if (!u && c) {
      result.push({ tag: 'missing', word: c });
      errorFound = true;
    } else {
      const dist = levenshtein(c, u);
      const threshold = Math.max(1, Math.floor(Math.max(c.length, u.length) * 0.3));

      if (dist <= threshold) {
        let diffIndex = -1;
        for (let j = 0; j < c.length; j++) {
          if (c[j] !== u[j]) {
            diffIndex = j;
            break;
          }
        }
        result.push({ tag: 'typo', word: u, correctWord: c, diffIndex });
      } else {
        result.push({ tag: 'typo', word: u, correctWord: c, diffIndex: -1 });
      }
      errorFound = true;
    }
  }

  return { result };
};

const InputChecker = memo(({ sentence, onResult, onNext, isLoading }: Props) => {
  const [userText, setUserText] = useState('');
  const [lastResult, setLastResult] = useState<LastResultType | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);
  const [isExactMatch, setIsExactMatch] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const checkExactMatch = useCallback(() => {
    console.log('checkExactMatch');
    if (!sentence || !userText?.trim()) return false;
    return normalize(sentence.text) === normalize(userText);
  }, [sentence, userText]);

  useEffect(() => {
    setUserText('');
    setLastResult(null);
    setIsSkipped(false);
    setIsExactMatch(false);
  }, [sentence.id]);

  const handleCheck = useCallback(() => {
    const { result } = computeWordDiff(sentence.text, userText);
    setLastResult({ result, correct: sentence.text });
    setIsExactMatch(checkExactMatch());
    onResult?.({ detailed: result });
  }, [sentence, userText, onResult]);

  const handleSkip = useCallback(() => {
    setUserText(sentence.text);
    setIsSkipped(true);
    setLastResult(null);
    setIsExactMatch(true);
  }, [sentence.text]);

  const handleNext = useCallback(() => onNext?.(), [onNext]);

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
    <Card className="p-6">
      <div className="space-y-4">
        <Textarea
          ref={inputRef}
          placeholder="Nhập câu bạn nghe được..."
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          disabled={isSkipped}
          className="min-h-[120px] md:text-lg"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCheck();
            }
          }}
        />

        <div className="flex gap-2">
          {isExactMatch ? (
            <Button size="lg" onClick={handleNext}>
              {isLoading ? 'Đang tải...' : 'Tiếp theo'}
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={handleCheck}>
                Kiểm tra
              </Button>
              <Button size="lg" variant="outline" onClick={handleSkip}>
                Bỏ qua
              </Button>
            </>
          )}
        </div>

        {lastResult && rendered && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              {isExactMatch ? (
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
            <div className="rounded-lg border bg-gray-50 p-4 text-xl text-gray-600">
              {rendered.correctLine}
            </div>
          </div>
        )}
        {isSkipped ||
          (isExactMatch && <TranslationCard translation={sentence.translation || ''} />)}
      </div>
    </Card>
  );
});
InputChecker.displayName = 'InputChecker';
export default InputChecker;
