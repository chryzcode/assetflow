"use client";

import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { validateToken } from "@/lib/auth";

type AuthState = {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  error: string | null;
};

type AuthAction =
  | { type: "LOGIN"; payload: { token: string; user: any } }
  | { type: "LOGOUT" }
  | { type: "ERROR"; payload: string };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case "ERROR":
      return {
        ...state,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        const isValid = await validateToken(token);
        if (isValid) {
          dispatch({
            type: "LOGIN",
            payload: {
              token,
              user: JSON.parse(storedUser),
            },
          });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch({ type: "LOGOUT" });
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);


  if (!isInitialized) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
