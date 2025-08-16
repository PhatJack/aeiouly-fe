"use client";
import { UserSchema } from "@/lib/schema/user.schema";
import { getMeApi } from "@/services/auth/get-me.api";
import { getCookie } from "cookies-next";
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
}

const initialState: InitialAuthContextType = {
  user: null,
  logout: () => {},
};

export type AuthAction =
  | {
      type: "SET_USER";
      payload: UserSchema | null;
    }
  | {
      type: "LOGOUT";
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
    default:
      return state;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getUser = async () => {
      const res = await getMeApi();
      if (res) {
        dispatch({ type: "SET_USER", payload: res });
      }
    };
    if (getCookie("isLoggedIn") === "1") {
      getUser();
    }
  }, [getCookie("isLoggedIn")]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return [context.state, context.dispatch] as const;
};
