import { SessionGoalBaseSchema } from '@/lib/schema/session-goal.schema';
import { SoundBaseSchema } from '@/lib/schema/sound.schema';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type PanelType = 'soundcloudPlayer' | 'studyStats' | 'backgroundIframe' | 'sound';

interface SoloStore {
  // State
  isOpenPomodoro: boolean;
  isOpenSessionGoal: boolean;
  isOpenFullScreen: boolean;
  activePanel: PanelType | null;
  quote: { content: string; author: string };
  isDisplayQuote: boolean;
  volume: number;
  backgroundURL: string;
  isAddYtbScript: boolean;
  activeSounds: SoundBaseSchema[];
  completedGoals: SessionGoalBaseSchema[];
  totalOpenGoals: number;
  soundcloudUrl: string;

  // Actions
  toggleButton: (key: 'isOpenPomodoro' | 'isOpenSessionGoal') => void;
  setActivePanel: (panel: PanelType | null) => void;
  toggleFullScreen: (isOpen: boolean) => void;
  shuffleQuote: (quote: { content: string; author: string }) => void;
  toggleQuote: () => void;
  setVolume: (volume: number) => void;
  setBackground: (url: string) => void;
  setAddYtbScript: (value: boolean) => void;
  saveActiveSounds: (sounds: SoundBaseSchema[]) => void;
  saveCompletedGoal: (goal: SessionGoalBaseSchema) => void;
  saveOpenGoals: (count: number) => void;
  setSoundcloudUrl: (url: string) => void;
}

export const useSoloStore = create<SoloStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial State
        isOpenPomodoro: true,
        isOpenSessionGoal: true,
        isOpenFullScreen: false,
        activePanel: 'backgroundIframe',
        isDisplayQuote: true,
        quote: {
          content: "Don't let yesterday take up too much of today.",
          author: 'Will Rogers',
        },
        volume: 0,
        backgroundURL: 'https://www.youtube.com/watch?v=5wRWniH7rt8',
        isAddYtbScript: false,
        activeSounds: [],
        completedGoals: [],
        totalOpenGoals: 0,
        soundcloudUrl: '',

        // Actions
        toggleButton: (key) => set((state) => ({ [key]: !state[key] })),

        setActivePanel: (panel) =>
          set((state) => ({
            activePanel: state.activePanel === panel ? null : panel,
          })),

        toggleFullScreen: (isOpen) => set({ isOpenFullScreen: isOpen }),

        shuffleQuote: (quote) => set({ quote }),

        toggleQuote: () => set((state) => ({ isDisplayQuote: !state.isDisplayQuote })),

        setVolume: (volume) => set({ volume }),

        setBackground: (url) => set({ backgroundURL: url }),

        setAddYtbScript: (value) => set({ isAddYtbScript: value }),

        saveActiveSounds: (sounds) => set({ activeSounds: sounds }),

        saveCompletedGoal: (goal) =>
          set((state) => ({
            completedGoals: [...state.completedGoals, goal],
          })),

        saveOpenGoals: (count) => set({ totalOpenGoals: count }),

        setSoundcloudUrl: (url) => set({ soundcloudUrl: url }),
      }),
      {
        name: 'solo-storage', // localStorage key
        partialize: (state) => ({
          backgroundURL: state.backgroundURL,
          soundcloudUrl: state.soundcloudUrl, // Persist soundcloud URL
        }),
      }
    )
  )
);
