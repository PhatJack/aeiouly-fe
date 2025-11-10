import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// This function converts the string to lowercase, then perform the conversion
export function toLowerCaseNonAccentVietnamese(str: string) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

// This function keeps the casing unchanged for str, then perform the conversion
export function toNonAccentVietnamese(str: string) {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export function parseDefinitions(raw: string) {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const phonetics: string[] = [];
  const sections: {
    pos: string;
    meanings: { text: string; examples: string[] }[];
  }[] = [];
  const idioms: {
    phrase: string;
    meanings: { text: string; examples: string[] }[];
  }[] = [];

  let currentSection: (typeof sections)[number] | null = null;
  let currentMeaning: { text: string; examples: string[] } | null = null;
  let currentIdiom: (typeof idioms)[number] | null = null;

  for (const line of lines) {
    if (/^\/.+\/$/.test(line)) {
      // phonetics
      phonetics.push(line);
    } else if (line.startsWith('*')) {
      // new POS
      if (currentMeaning) {
        if (currentSection) currentSection.meanings.push(currentMeaning);
        if (currentIdiom) currentIdiom.meanings.push(currentMeaning);
        currentMeaning = null;
      }
      if (currentSection) sections.push(currentSection);
      currentSection = { pos: line.replace('*', '').trim(), meanings: [] };
    } else if (line.startsWith('•')) {
      // new idiom
      if (currentMeaning) {
        if (currentSection) currentSection.meanings.push(currentMeaning);
        if (currentIdiom) currentIdiom.meanings.push(currentMeaning);
        currentMeaning = null;
      }
      if (currentSection) {
        sections.push(currentSection);
        currentSection = null;
      }
      if (currentIdiom) idioms.push(currentIdiom);

      const idiomLine = line.replace('•', '').trim();
      // Trường hợp "• idiom nghĩa luôn"
      const [phrase, ...rest] = idiomLine.split(/\s{2,}| - /);
      currentIdiom = {
        phrase,
        meanings: rest.length ? [{ text: rest.join(' '), examples: [] }] : [],
      };
    } else if (line.startsWith('-')) {
      if (currentMeaning) {
        if (currentSection) currentSection.meanings.push(currentMeaning);
        if (currentIdiom) currentIdiom.meanings.push(currentMeaning);
      }
      currentMeaning = { text: line.replace('-', '').trim(), examples: [] };
    } else if (line.startsWith('▫')) {
      currentMeaning?.examples.push(line.replace('▫', '').trim());
    } else {
      // fallback: nối vào nghĩa hiện tại
      if (currentMeaning) {
        currentMeaning.text += ' ' + line;
      }
    }
  }

  // push leftovers
  if (currentMeaning) {
    if (currentSection) currentSection.meanings.push(currentMeaning);
    if (currentIdiom) currentIdiom.meanings.push(currentMeaning);
  }
  if (currentSection) sections.push(currentSection);
  if (currentIdiom) idioms.push(currentIdiom);

  return { phonetics, sections, idioms };
}

export const blobToAudio = (blob?: Blob) => {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  return url;
};

export const getFallbackInitials = (name: string) => {
  if (!name) return 'AE';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  } else {
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }
};

export const getCEFRLevelRandom = () => {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const randomIndex = Math.floor(Math.random() * levels.length);
  return levels[randomIndex];
};

export function UrlToEmbeded(url: string): { videoId: string; embedUrl: string } | undefined {
  if (!url || typeof url !== 'string') {
    return undefined;
  }

  // Regular expression to extract the video ID from common YouTube URL formats
  const videoIdMatch = url.match(/(?:watch\?v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch || !videoIdMatch[1]) {
    return undefined; // Return undefined if no valid video ID is found
  }

  const videoId = videoIdMatch[1];
  const embedBase = `https://www.youtube.com/embed/${videoId}`;

  // Build the URL with query parameters
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    enablejsapi: '1',
    loop: '1',
    controls: '0',
    playsinline: '1',
    widgetid: '2',
    playlist: videoId, // Required for loop to work with a single video
  });

  const embedUrl = `${embedBase}?${params.toString()}`;

  return { videoId, embedUrl };
}

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-error';
};

export const getScoreLabel = (score: number) => {
  if (score >= 80) return 'Tốt';
  if (score >= 60) return 'Khá';
  return 'Cần cải thiện';
};

export const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    A1: 'bg-green-100 text-green-700 border-green-300',
    A2: 'bg-blue-100 text-blue-700 border-blue-300',
    B1: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    B2: 'bg-orange-100 text-orange-700 border-orange-300',
    C1: 'bg-red-100 text-red-700 border-red-300',
    C2: 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return colors[level] || 'bg-gray-100 text-gray-700 border-gray-300';
};

export const normalizeText = (s: string) =>
  s
    .toLowerCase()
    // ✅ Chuyển toàn bộ string về lowercase để so sánh không phân biệt hoa/thường

    .replace(/[""„"«»]/g, '"')
    // ✅ Chuẩn hóa các loại dấu ngoặc kép fancy Unicode thành dấu " chuẩn
    // Ví dụ: “ ” „ « »  => "

    .replace(/[''`]/g, "'")
    // ✅ Chuẩn hóa các loại apostrophe (` ‘ ’) thành dấu '
    // Ví dụ: `don't` , ‘‘hello’’ , ain’t  => don't, 'hello', ain't

    .replace(/(^|\s)'+/g, '$1')
    // ✅ Xóa apostrophe đứng đầu từ (leading apostrophe)
    // (^|\s)  : đầu chuỗi hoặc sau dấu cách
    // '+      : một hoặc nhiều dấu '
    // $1      : giữ nguyên vị trí trước đó, bỏ toàn bộ dấu '
    // Ví dụ: "'rob" → "rob", " 'fear" → "fear", nhưng "don't" vẫn giữ nguyên

    .replace(/[^a-z0-9'\s]+/g, ' ')
    // ✅ Xóa mọi ký tự không phải chữ, số, space hoặc apostrophe
    // Loại bỏ: !@#$%^&*()_+=/:;,.?~ …
    // Nhưng giữ lại dấu ' bên trong từ
    // Ví dụ: "rock&roll!" → "rock roll"

    .replace(/\s+/g, ' ')
    // ✅ Gom nhiều khoảng trắng liên tiếp thành 1 space
    // Ví dụ: "hello    world" → "hello world"

    .trim();
// ✅ Xóa space thừa đầu/cuối chuỗi

export const convertWordPos = (pos: string) => {
  switch (pos.toLowerCase()) {
    case 'noun':
      return 'N';
    case 'verb':
      return 'V';
    case 'adjective':
      return 'Adj';
    case 'adverb':
      return 'Adv';
    case 'pronoun':
      return 'Pron';
    case 'preposition':
      return 'Prep';
    case 'conjunction':
      return 'Conj';
    case 'interjection':
      return 'Interj';
    case 'determiner':
      return 'Det';
    case 'article':
      return 'Art';
    default:
      return pos; // Trả về nguyên bản nếu không tìm thấy
  }
};

export const checkSentence = (text: string): { type: 'word' | 'sentence'; text: string } => {
  return text.trim().includes(' ')
    ? { type: 'sentence', text: text.trim() }
    : { type: 'word', text: text.trim() };
};
