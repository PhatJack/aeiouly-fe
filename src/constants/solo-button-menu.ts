import { PanelType } from '@/hooks/use-solo-store';

import { ImageIcon, Music, Quote, TrendingUp, Volume2 } from 'lucide-react';

export interface MenuButtonItem {
  label: string;
  variable: PanelType;
  icon: typeof Quote;
}

export const menuButton: MenuButtonItem[] = [
  // {
  //   label: 'Soundcloud Player',
  //   variable: 'soundcloudPlayer',
  //   icon: Music,
  // },
  {
    label: 'Video | Ảnh nền',
    variable: 'backgroundIframe',
    icon: ImageIcon,
  },
  {
    label: 'Âm thanh nền',
    variable: 'sound',
    icon: Volume2,
  },
  {
    label: 'Thống kê học tập',
    variable: 'studyStats',
    icon: TrendingUp,
  },
];
