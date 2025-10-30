import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface PomodoroState {
  // Time settings (in seconds)
  focusTime: number;
  breakTime: number;
  remainingTime: number;

  // Mode and status
  isFocusMode: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isLoopMode: boolean;

  // Statistics
  completedSessions: number;
  totalFocusTime: number;
  totalBreakTime: number;
}

interface PomodoroStore extends PomodoroState {
  // Time management actions
  setFocusTime: (seconds: number) => void;
  setBreakTime: (seconds: number) => void;
  setRemainingTime: (seconds: number) => void;

  // Timer control actions
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  togglePause: () => void;

  // Mode actions
  setIsFocusMode: (isFocus: boolean) => void;
  switchMode: () => void;
  setIsLoopMode: (isLoop: boolean) => void;

  // Time adjustment actions
  handleTimeChange: (params: { type: 'focus' | 'break'; operation: 'add' | 'subtract' }) => void;

  // Utility actions
  tick: () => void;
  completeSession: () => void;
}

// Utility function outside the store to avoid re-render issues
export const formatTime = (
  seconds: number
): { hours: string; minutes: string; seconds: string } => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    hours: hrs.toString().padStart(2, '0'),
    minutes: mins.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  };
};

const INITIAL_FOCUS_TIME = 25 * 60; // 25 minutes
const INITIAL_BREAK_TIME = 5 * 60; // 5 minutes
const TIME_INCREMENT = 5 * 60; // 5 minutes

export const usePomodoroStore = create<PomodoroStore>()((set, get) => ({
  // Initial state
  focusTime: INITIAL_FOCUS_TIME,
  breakTime: INITIAL_BREAK_TIME,
  remainingTime: INITIAL_FOCUS_TIME,
  isFocusMode: true,
  isRunning: false,
  isPaused: false,
  isLoopMode: true,
  completedSessions: 0,
  totalFocusTime: 0,
  totalBreakTime: 0,

  // Time setters
  setFocusTime: (seconds) =>
    set((state) => ({
      focusTime: seconds,
      remainingTime: state.isFocusMode ? seconds : state.remainingTime,
    })),

  setBreakTime: (seconds) =>
    set((state) => ({
      breakTime: seconds,
      remainingTime: !state.isFocusMode ? seconds : state.remainingTime,
    })),

  setRemainingTime: (seconds) => set({ remainingTime: Math.max(0, seconds) }),

  // Timer controls
  startTimer: () =>
    set((state) => ({
      isRunning: true,
      isPaused: false,
      remainingTime: state.isFocusMode ? state.focusTime : state.breakTime,
    })),

  pauseTimer: () => set({ isPaused: true }),

  resumeTimer: () => set({ isPaused: false }),

  toggleTimer: () =>
    set((state) => {
      if (!state.isRunning) {
        return {
          isRunning: true,
          isPaused: false,
          remainingTime: state.isFocusMode ? state.focusTime : state.breakTime,
        };
      }
      return state;
    }),

  resetTimer: () =>
    set((state) => ({
      isRunning: false,
      isPaused: false,
      remainingTime: state.isFocusMode ? state.focusTime : state.breakTime,
    })),

  togglePause: () =>
    set((state) => ({
      isPaused: !state.isPaused,
    })),

  // Mode management
  setIsFocusMode: (isFocus) =>
    set((state) => ({
      isFocusMode: isFocus,
      remainingTime: isFocus ? state.focusTime : state.breakTime,
    })),

  switchMode: () =>
    set((state) => {
      const newMode = !state.isFocusMode;
      return {
        isFocusMode: newMode,
        remainingTime: newMode ? state.focusTime : state.breakTime,
        isRunning: state.isLoopMode,
        isPaused: false,
      };
    }),

  setIsLoopMode: (isLoop) => set({ isLoopMode: isLoop }),

  // Time adjustments
  handleTimeChange: ({ type, operation }) =>
    set((state) => {
      if (state.isRunning) return state;

      const currentTime = type === 'focus' ? state.focusTime : state.breakTime;
      const delta = operation === 'add' ? TIME_INCREMENT : -TIME_INCREMENT;
      const newTime = Math.max(TIME_INCREMENT, currentTime + delta);

      if (type === 'focus') {
        return {
          focusTime: newTime,
          remainingTime: state.isFocusMode ? newTime : state.remainingTime,
        };
      } else {
        return {
          breakTime: newTime,
          remainingTime: !state.isFocusMode ? newTime : state.remainingTime,
        };
      }
    }),

  // Timer tick (called every second)
  tick: () => {
    const state = get();
    if (!state.isRunning || state.isPaused) return;

    if (state.remainingTime <= 1) {
      // Timer completed
      get().completeSession();
      return;
    }

    set({
      remainingTime: state.remainingTime - 1,
    });
  },

  // Session completion
  completeSession: () => {
    const state = get();

    if (state.isFocusMode) {
      // Completed focus session
      if (state.isLoopMode) {
        // Switch to break mode
        set({
          isFocusMode: false,
          remainingTime: state.breakTime,
          completedSessions: state.completedSessions + 1,
          totalFocusTime: state.totalFocusTime + state.focusTime,
          isRunning: true,
          isPaused: false,
        });
      } else {
        // Stop timer
        set({
          isRunning: false,
          isPaused: false,
          remainingTime: state.focusTime,
          completedSessions: state.completedSessions + 1,
          totalFocusTime: state.totalFocusTime + state.focusTime,
        });
      }
    } else {
      // Completed break session
      if (state.isLoopMode) {
        // Switch back to focus mode
        set({
          isFocusMode: true,
          remainingTime: state.focusTime,
          totalBreakTime: state.totalBreakTime + state.breakTime,
          isRunning: true,
          isPaused: false,
        });
      } else {
        // Stop timer
        set({
          isRunning: false,
          isPaused: false,
          remainingTime: state.breakTime,
          totalBreakTime: state.totalBreakTime + state.breakTime,
        });
      }
    }

    return get();
  },
}));
