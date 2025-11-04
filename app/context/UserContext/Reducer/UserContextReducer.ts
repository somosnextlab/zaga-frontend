import { produce } from "immer";
import { initialState } from "../UserContextUtils";
import {
  type UserContextStateType,
  type ActionType,
  UserAction,
} from "../UserContextContext.types";

/**
 * Reducer para el contexto de usuario
 */
export const reducer = produce(
  (state: UserContextStateType, action: ActionType): UserContextStateType => {
    switch (action.type) {
      case UserAction.SET_ROLE: {
        state.role = action.payload;
        return state;
      }

      case UserAction.SET_LOADING: {
        state.loading = action.payload;
        return state;
      }

      case UserAction.RESET: {
        return (state = initialState);
      }

      default:
        return state;
    }
  }
);
