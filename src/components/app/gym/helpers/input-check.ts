import { normalizeText } from '@/lib/utils';

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
export const levenshtein = (a: string, b: string) => {
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

export const computeWordDiff = (correctRaw: string, userRaw: string) => {
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
