"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import type { UserContextType } from "./UserContextContext.types";
import {
  setRoleAction,
  setLoadingAction,
  resetAction,
} from "./Reducer/UserContextActions";
import { initialState } from "./UserContextUtils";
import { reducer } from "./Reducer/UserContextReducer";
import { UserRole } from "@/app/types/user.types";

/**
 * Contexto de usuario para gestionar el rol del usuario autenticado
 */
const UserContext = createContext<UserContextType>({
  state: initialState,
  actions: {},
});

/**
 * Provider del contexto de usuario
 */
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setRole = useCallback(
    (role: UserRole) => setRoleAction(dispatch, role),
    [dispatch]
  );

  const setLoading = useCallback(
    (value: boolean) => setLoadingAction(dispatch, value),
    [dispatch]
  );

  const reset = useCallback(() => resetAction(dispatch), [dispatch]);

  const fullCtx: UserContextType = useMemo(
    () => ({
      state: { ...state },
      actions: {
        setRole,
        setLoading,
        reset,
      },
    }),
    [state, setRole, setLoading, reset]
  );

  return (
    <UserContext.Provider value={fullCtx}>{children}</UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserContext, useUserContext };
export default UserProvider;
