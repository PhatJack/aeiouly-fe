'use client';

import { type ReactNode, createContext, useContext, useEffect, useRef } from 'react';

import { useGetMeQuery } from '@/services/auth/get-me.api';
import { type AuthStore, createAuthStore } from '@/stores/auth-store';

import { useStore } from 'zustand';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined);

export interface AuthStoreProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createAuthStore();
  }

  const { data } = useGetMeQuery();

  useEffect(() => {
    if (data && storeRef.current) {
      storeRef.current.getState().setUser(data);
    }
  }, [data]);

  return <AuthStoreContext.Provider value={storeRef.current}>{children}</AuthStoreContext.Provider>;
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = useContext(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`);
  }

  return useStore(authStoreContext, selector);
};
