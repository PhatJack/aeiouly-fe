import { UserSchema } from '@/lib/schema/user.schema';

import { createStore } from 'zustand';

export type AuthState = {
  user: UserSchema | null;
};

export type AuthActions = {
  setUser: (user: UserSchema | null) => void;
  logout: () => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultAuthStore: AuthState = {
  user: null,
};

export const createAuthStore = (initState: AuthState = defaultAuthStore) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }));
};
