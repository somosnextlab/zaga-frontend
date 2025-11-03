import type { UserContextAction } from "../UserContextContext.types";

/**
 * Crea una acción para establecer el rol del usuario
 */
export const setRoleAction = (role: string | null): UserContextAction => ({
  type: "SET_ROLE",
  payload: role,
});

/**
 * Crea una acción para establecer el estado de carga
 */
export const setLoadingAction = (loading: boolean): UserContextAction => ({
  type: "SET_LOADING",
  payload: loading,
});

/**
 * Crea una acción para resetear el estado
 */
export const resetAction = (): UserContextAction => ({
  type: "RESET",
});

