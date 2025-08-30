"use client";
import { UserSchema } from "@/lib/schema/user.schema";
import { useGetMeQuery } from "@/services/auth/get-me.api";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
  createContext,
  useEffect,
  useContext,
  useCallback,
} from "react";

interface InitialAuthContextType {
  user: UserSchema | null;
  logout: () => void;
  isLoading?: boolean;
}

const initialState: InitialAuthContextType = {
  user: null,
  logout: () => {},
  isLoading: false,
};

export type AuthAction =
  | {
      type: "SET_USER";
      payload: UserSchema | null;
    }
  | {
      type: "LOGOUT";
    }
  | {
      type: "SET_LOADING";
      payload: boolean;
    };

export const AuthContext = createContext<{
  state: InitialAuthContextType;
  dispatch: Dispatch<AuthAction>;
} | null>(null);

const reducer = (
  state: InitialAuthContextType,
  action: AuthAction
): InitialAuthContextType => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data });
    } else if (error) {
      // If there's an error fetching user data, reset user state
      dispatch({ type: "SET_USER", payload: null });
    }
  }, [data, error]);

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: "SET_LOADING", payload: true });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isLoading]);

  // Enhanced logout function that clears all queries
  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    queryClient.clear(); // Clear all queries
    queryClient.invalidateQueries(); // Invalidate all queries
  }, [queryClient]);

  const value = useMemo(() => ({ 
    state: { ...state, logout }, 
    dispatch 
  }), [state, dispatch, logout]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): [
  InitialAuthContextType,
  Dispatch<AuthAction>
] => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return [context.state, context.dispatch];
};
