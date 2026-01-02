import { PanelType } from '@/hooks/use-solo-store';

import { ImageIcon, Music, Quote, TrendingUp, Volume2 } from 'lucide-react';

export interface MenuButtonItem {
  label: string;
  variable: PanelType;
  icon: typeof Quote;
}

export const menuButton: MenuButtonItem[] = [
  {
    label: 'Soundcloud Player',
    variable: 'soundcloudPlayer',
    icon: Music,
  },
  {
    label: 'Background',
    variable: 'backgroundIframe',
    icon: ImageIcon,
  },
  {
    label: 'Sounds',
    variable: 'sound',
    icon: Volume2,
  },
  {
    label: 'Study Stats',
    variable: 'studyStats',
    icon: TrendingUp,
  },
];
