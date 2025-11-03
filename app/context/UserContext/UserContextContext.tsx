"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type { UserContextType } from "./UserContextContext.types";
import { userContextReducer, initialState } from "./Reducer/UserContextReducer";
import {
  setRoleAction,
  setLoadingAction,
  resetAction,
} from "./Reducer/UserContextActions";

/**
 * Contexto de usuario para gestionar el rol del usuario autenticado
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Provider del contexto de usuario
 */
export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userContextReducer, initialState);

  const setRole = useCallback((role: string | null) => {
    dispatch(setRoleAction(role));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch(setLoadingAction(loading));
  }, []);

  const reset = useCallback(() => {
    dispatch(resetAction());
  }, []);

  const value: UserContextType = {
    ...state,
    setRole,
    setLoading,
    reset,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Hook personalizado para acceder al contexto de usuario
 * @throws Error si se usa fuera del UserContextProvider
 */
export function useUserContext(): UserContextType {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext debe usarse dentro de UserContextProvider");
  }

  return context;
}
