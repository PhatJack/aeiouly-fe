import { PanelType } from '@/hooks/use-solo-store';

import { ImageIcon, Music, Quote, TrendingUp, Volume2 } from 'lucide-react';

export interface MenuButtonItem {
  label: string;
  variable: PanelType;
  icon: typeof Quote;
}

export const getMenuButton = (t: (key: string) => string): MenuButtonItem[] => [
  {
    label: t('buttons.soundcloudPlayer'),
    variable: 'soundcloudPlayer',
    icon: Music,
  },
  {
    label: t('buttons.backgroundIframe'),
    variable: 'backgroundIframe',
    icon: ImageIcon,
  },
  {
    label: t('buttons.sound'),
    variable: 'sound',
    icon: Volume2,
  },
  {
    label: t('buttons.studyStats'),
    variable: 'studyStats',
    icon: TrendingUp,
  },
];
