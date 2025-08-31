import { toZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export function distanceToNowVN(date: string | Date): string {
  const timeZone = "Asia/Ho_Chi_Minh";

  let utcDate: Date;
  if (typeof date === "string") {
    // Ensure it's parsed as UTC
    utcDate = date.endsWith("Z") ? new Date(date) : new Date(date + "Z");
  } else {
    utcDate = date;
  }

  const vnDate = toZonedTime(utcDate, timeZone);

  return formatDistanceToNow(vnDate, { addSuffix: true, locale: vi });
}
