import { create } from 'zustand';

type State = {
  hasUnsavedChanges: boolean;
  setUnsaved: (v: boolean) => void;
  urlToGoBack?: string;
  setUrlToGoBack?: (url: string) => void;
};

export const useBlockNavigation = create<State>((set) => ({
  hasUnsavedChanges: false,
  setUnsaved: (v) => set({ hasUnsavedChanges: v }),
  urlToGoBack: undefined,
  setUrlToGoBack: (url: string) => set({ urlToGoBack: url }),
}));
