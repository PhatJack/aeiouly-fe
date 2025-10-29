import { SessionGoalBaseSchema } from '@/lib/schema/session-goal.schema';

import { createStore } from 'zustand/vanilla';

export type PanelType = 'quote' | 'studyStats' | 'backgroundIframe' | 'sound';

export interface SoundState {
  stream_url: string;
  sound_name: string;
  volume: number;
}

export type SpaceStudyStore = {
  isOpenPomodoro: boolean;
  isOpenSessionGoal: boolean;
  isOpenFullScreen: boolean;
  activePanel: PanelType | null;
  quote: { content: string; author: string };
  isDisplayQuote: boolean;
  volume: number;
  backgroundURL: string;
  isAddYtbScript: boolean;
  activeSounds: SoundState[];
  completedGoals: SessionGoalBaseSchema[];
  totalOpenGoals: number;
};

export type SpaceStudyActions = {
  // Actions
  toggleButton: (key: 'isOpenPomodoro' | 'isOpenSessionGoal') => void;
  setActivePanel: (panel: PanelType | null) => void;
  toggleFullScreen: (isOpen: boolean) => void;
  shuffleQuote: (quote: { content: string; author: string }) => void;
  toggleQuote: () => void;
  setVolume: (volume: number) => void;
  setBackground: (url: string) => void;
  setAddYtbScript: (value: boolean) => void;
  saveActiveSounds: (sounds: SoundState[]) => void;
  saveCompletedGoal: (goal: SessionGoalBaseSchema) => void;
  saveOpenGoals: (count: number) => void;
};

export type SpaceStudyStoreType = SpaceStudyStore & SpaceStudyActions;

export const defaultSpaceStudyStore: SpaceStudyStore = {
  isOpenPomodoro: false,
  isOpenSessionGoal: false,
  isOpenFullScreen: false,
  activePanel: null,
  quote: { content: '', author: '' },
  isDisplayQuote: true,
  volume: 50,
  backgroundURL: '',
  isAddYtbScript: false,
  activeSounds: [],
  completedGoals: [],
  totalOpenGoals: 0,
};

export const createSpaceStudyStore = (initState: SpaceStudyStore = defaultSpaceStudyStore) => {
  return createStore<SpaceStudyStoreType>()((set) => ({
    ...initState,
    toggleButton: (key) =>
      set((state) => ({
        [key]: !state[key as 'isOpenPomodoro' | 'isOpenSessionGoal'],
      })),
    setActivePanel: (panel) => set({ activePanel: panel }),
    toggleFullScreen: (isOpen) => set({ isOpenFullScreen: isOpen }),
    shuffleQuote: (quote) => set({ quote }),
    toggleQuote: () =>
      set((state) => ({
        isDisplayQuote: !state.isDisplayQuote,
      })),
    setVolume: (volume) => set({ volume }),
    setBackground: (url) => set({ backgroundURL: url }),
    setAddYtbScript: (value) => set({ isAddYtbScript: value }),
    saveActiveSounds: (sounds) => set({ activeSounds: sounds }),
    saveCompletedGoal: (goal) =>
      set((state) => ({
        completedGoals: [...state.completedGoals, goal],
      })),
    saveOpenGoals: (count) => set({ totalOpenGoals: count }),
  }));
};
