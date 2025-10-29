import { PanelType } from '@/hooks/use-solo-store';

import { Quote, TrendingUp, Video, Volume2 } from 'lucide-react';

export interface MenuButtonItem {
  label: string;
  variable: PanelType;
  icon: typeof Quote;
}

export const menuButton: MenuButtonItem[] = [
  {
    label: 'Quote',
    variable: 'quote',
    icon: Quote,
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
  {
    label: 'Background',
    variable: 'backgroundIframe',
    icon: Video,
  },
];
