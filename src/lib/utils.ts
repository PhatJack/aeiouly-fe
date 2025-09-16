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
