import { Locale, formatDistanceToNow } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { vi } from 'date-fns/locale';

export function distanceToNowVN(date: string | Date, locale: Locale = vi): string {
  const timeZone = 'Asia/Ho_Chi_Minh';

  let utcDate: Date;
  if (typeof date === 'string') {
    // Ensure it's parsed as UTC
    utcDate = new Date(date);
  } else {
    utcDate = date;
  }

  const vnDate = toZonedTime(utcDate, timeZone);

  return formatDistanceToNow(vnDate, { addSuffix: true, locale: locale });
}

export const formatTimezoneVN = (date?: string) => {
  if (!date) return '';

  return formatInTimeZone(date, 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy', { locale: vi });
};
