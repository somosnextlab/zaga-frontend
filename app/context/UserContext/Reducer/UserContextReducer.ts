import type { UserContextState, UserContextAction } from "../UserContextContext.types";

/**
 * Estado inicial del contexto de usuario
 */
export const initialState: UserContextState = {
  role: null,
  loading: false,
};

/**
 * Reducer para el contexto de usuario
 */
export function userContextReducer(
  state: UserContextState,
  action: UserContextAction
): UserContextState {
  switch (action.type) {
    case "SET_ROLE":
      return {
        ...state,
        role: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

