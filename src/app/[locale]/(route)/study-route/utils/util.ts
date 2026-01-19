import { getTranslations } from 'next-intl/server';

import { IconName } from 'lucide-react/dynamic';

export const getSkillIcon = (skillType: string): IconName => {
  switch (skillType) {
    case 'reading':
      return 'book-open';
    case 'listening':
      return 'headphones';
    case 'speaking':
      return 'mic';
    case 'writing':
      return 'pen-tool';
    default:
      return 'book-open';
  }
};

export const getStatusText = async (status: string) => {
  const t = await getTranslations('studyRoute.status');
  switch (status) {
    case 'done':
      return t('completed');
    case 'in_progress':
      return t('inProgress');
    default:
      return t('start');
  }
};

export const getGenderText = async (gender: string) => {
  const t = await getTranslations('studyRoute.gender');
  switch (gender) {
    case 'male':
      return t('male');
    case 'female':
      return t('female');
    default:
      return t('unknown');
  }
};
