import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Merges translation message objects with conflict detection.
 * Each message file should export an object with unique top-level namespace keys.
 * For example: auth.json exports { "auth": {...} }, setting.json exports { "setting": {...} }
 * This prevents key collisions between different message files.
 */
function mergeMessages(...messageSources: Record<string, unknown>[]): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  const conflicts: string[] = [];

  for (const source of messageSources) {
    for (const key in source) {
      if (key in merged) {
        conflicts.push(key);
      }
      merged[key] = source[key];
    }
  }

  if (conflicts.length > 0) {
    console.warn(
      `[i18n] Warning: Duplicate keys found in message files: ${conflicts.join(', ')}. ` +
        'Later files will overwrite earlier ones. Ensure each message file uses unique top-level namespace keys.'
    );
  }

  return merged;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Load all message files
  // Main messages contain general app translations (HomePage, Sidebar, Header, etc.)
  const mainMessages = (await import(`../../messages/${locale}.json`)).default;
  // Domain-specific messages are organized by namespace to avoid key conflicts
  const settingMessages = (await import(`../../messages/${locale}/setting.json`)).default;
  const authMessages = (await import(`../../messages/${locale}/auth.json`)).default;
  const vocabularyMessages = (await import(`../../messages/${locale}/vocabulary.json`)).default;
  const spaceMessages = (await import(`../../messages/${locale}/space.json`)).default;

  return {
    locale,
    // Merge all messages with explicit conflict detection
    messages: mergeMessages(
      mainMessages,
      settingMessages,
      authMessages,
      vocabularyMessages,
      spaceMessages
    ),
    // ...
  };
});
