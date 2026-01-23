import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { mergeMessages } from '@/utils/i18n-util';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const mainMessages = (await import(`../../messages/${locale}.json`)).default;
  const studyRouteMessages = (await import(`../../messages/${locale}/study-route.json`)).default;
  const settingMessages = (await import(`../../messages/${locale}/setting.json`)).default;
  const authMessages = (await import(`../../messages/${locale}/auth.json`)).default;
  const vocabularyMessages = (await import(`../../messages/${locale}/vocabulary.json`)).default;
  const spaceMessages = (await import(`../../messages/${locale}/space.json`)).default;
  const listeningMessages = (await import(`../../messages/${locale}/listening.json`)).default;
  const readingMessages = (await import(`../../messages/${locale}/reading.json`)).default;
  const paginationMessages = (await import(`../../messages/${locale}/pagination.json`)).default;
  const speakingMessages = (await import(`../../messages/${locale}/speaking.json`)).default;
  const writingMessages = (await import(`../../messages/${locale}/writing.json`)).default;
  const profileMessages = (await import(`../../messages/${locale}/profile.json`)).default;

  return {
    locale,
    messages: mergeMessages(
      mainMessages,
      studyRouteMessages,
      settingMessages,
      authMessages,
      vocabularyMessages,
      spaceMessages,
      listeningMessages,
      readingMessages,
      paginationMessages,
      speakingMessages,
      writingMessages,
      profileMessages
    ),
  };
});
