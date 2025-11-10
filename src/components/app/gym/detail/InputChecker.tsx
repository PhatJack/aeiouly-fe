import React, { JSX, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SentenceResponseSchema } from '@/lib/schema/listening-session.schema';
import { normalizeText } from '@/lib/utils';

import { CheckCircle2, TriangleAlert } from 'lucide-react';

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

/**
 * Tính khoảng cách Levenshtein (số thao tác tối thiểu để biến chuỗi a thành chuỗi b)
 * Các thao tác gồm:
 *  - Thêm ký tự (insert)
 *  - Xóa ký tự (delete)
 *  - Thay ký tự (substitute)
 *
 * Ví dụ:
 *  levenshtein("cat", "cut")  => 1 (thay 'a' -> 'u')
 *  levenshtein("cat", "cart") => 1 (thêm 'r')
 *  levenshtein("cart", "cat") => 1 (xóa 'r')
 */
const levenshtein = (a: string, b: string) => {
  // Nếu hai chuỗi giống hệt nhau -> không cần thay đổi
  if (a === b) return 0;

  const m = a.length; // độ dài chuỗi a
  const n = b.length; // độ dài chuỗi b

  // Nếu chuỗi a rỗng -> phải thêm n ký tự để thành b
  if (m === 0) return n;

  // Nếu chuỗi b rỗng -> phải xóa m ký tự từ a
  if (n === 0) return m;

  // Tạo ma trận (m+1) x (n+1)
  // dp[i][j] = số thao tác để biến a[0..i-1] thành b[0..j-1]
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // Điền cột đầu tiên: biến chuỗi có i ký tự thành chuỗi rỗng -> cần i lần xóa
  for (let i = 0; i <= m; i++) dp[i][0] = i;

  // Điền hàng đầu tiên: biến chuỗi rỗng thành chuỗi có j ký tự -> cần j lần thêm
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Duyệt từng ký tự trong chuỗi a và b
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Nếu ký tự giống nhau -> không cần hành động (cost = 0)
      // Nếu khác -> cần 1 thao tác thay thế
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // Xóa ký tự a[i-1]
        dp[i][j - 1] + 1, // Thêm ký tự b[j-1]
        dp[i - 1][j - 1] + cost // Thay ký tự a[i-1] -> b[j-1] (nếu khác)
      );
    }
  }

  // Kết quả nằm tại góc dưới bên phải
  return dp[m][n];
};

const computeWordDiff = (correctRaw: string, userRaw: string) => {
  const correct = normalizeText(correctRaw);
  const user = normalizeText(userRaw);

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

    // ✅ same word
    if (c === u && c) {
      result.push({ tag: 'correct', word: c });
    }
    // ✅ extra word beyond correct length — don’t mark as error
    else if (!c && u) {
      result.push({ tag: 'extra', word: u });
      // ❌ don't set errorFound = true here
    }
    // ❌ missing word — still an error
    else if (!u && c) {
      result.push({ tag: 'missing', word: c });
      errorFound = true;
    }
    // ❌ mismatch / typo
    else {
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

  // ✅ if only extra words and no real error, treat as correct
  const hasRealError = result.some((r) => ['typo', 'missing'].includes(r.tag));

  return { result, isExtraOnly: !hasRealError };
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
        <Textarea
          ref={inputRef}
          placeholder="Nhập câu bạn nghe được..."
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
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
            <div className="flex w-full justify-end">
              <Button size="lg" onClick={handleNext}>
                {isLoading ? 'Đang tải...' : 'Tiếp theo'}
              </Button>
            </div>
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
