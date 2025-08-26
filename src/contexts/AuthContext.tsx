"use client";
import { UserSchema } from "@/lib/schema/user.schema";
import { useGetMeQuery } from "@/services/auth/get-me.api";
import {
  Dispatch,
  ReactNode,
  useMemo,
  useReducer,
  createContext,
  useEffect,
  useContext,
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

  const { data, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_USER", payload: data });
    }
  }, [data]);

  useEffect(() => {
    if (isLoading) {
      dispatch({ type: "SET_LOADING", payload: true });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isLoading]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
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
