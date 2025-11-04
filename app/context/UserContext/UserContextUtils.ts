import { UserContextStateType } from "./UserContextContext.types";

/**
 * Estado inicial del contexto de usuario
 */
export const initialState: UserContextStateType = {
  role: null,
  loading: false,
};
