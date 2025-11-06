import { SessionDetailResponseSchema } from '@/lib/schema/listening-session.schema';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GymDetailState {
  // Session data
  session: SessionDetailResponseSchema | null;
  isStarted: boolean;
  currentSentenceIndex: number;
  userInput: string;
  showVideo: boolean;
  showTranslation: boolean;
  isAddYtbScript: boolean;
  isPlaying: boolean;
  playTrigger: number;

  // Actions
  setSession: (session: SessionDetailResponseSchema | null) => void;
  startLearning: () => void;
  setCurrentSentenceIndex: (index: number) => void;
  setAddYtbScript: (value: boolean) => void;
  setUserInput: (input: string) => void;
  setPlayTrigger: () => void;
  setIsPlaying: (value: boolean) => void;
  toggleVideo: () => void;
  toggleTranslation: () => void;
  handlePlay: () => void;
  reset: () => void;
}

const initialState = {
  session: null,
  isStarted: false,
  currentSentenceIndex: 0,
  userInput: '',
  showVideo: true,
  showTranslation: false,
  isAddYtbScript: false,
  playTrigger: 0,
};

export const useGymDetailStore = create<GymDetailState>()(
  devtools(
    (set) => ({
      ...initialState,

      setSession: (session) => set({ session }),

      startLearning: () => set({ isStarted: true }),

      setCurrentSentenceIndex: (index) =>
        set({
          currentSentenceIndex: index,
          userInput: '',
          showTranslation: false,
        }),

      setAddYtbScript: (value) => set({ isAddYtbScript: value }),

      setUserInput: (input) => set({ userInput: input }),

      toggleVideo: () => set((state) => ({ showVideo: !state.showVideo })),

      toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),

      handlePlay: () => set(() => ({ showVideo: true })),

      reset: () => set(initialState),

      setIsPlaying: (value: boolean) => set({ isPlaying: value }),

      setPlayTrigger: () =>
        set((state) => ({
          playTrigger: state.playTrigger + 1,
        })),
    }),
    {
      name: 'gym-detail-store',
    }
  )
);
