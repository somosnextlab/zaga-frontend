import { UserRole } from "@/app/types/user.types";
import { UserAction, type ActionType } from "../UserContextContext.types";

/**
 * Crea una acción para establecer el rol del usuario
 */
export const setRoleAction = (
  dispatch: React.Dispatch<ActionType>,
  role: UserRole
) => {
  dispatch({ type: UserAction.SET_ROLE, payload: role });
};

/**
 * Crea una acción para establecer el estado de carga
 */
export const setLoadingAction = (
  dispatch: React.Dispatch<ActionType>,
  value: boolean
) => {
  dispatch({ type: UserAction.SET_LOADING, payload: value });
};

/**
 * Crea una acción para resetear el estado
 */
export const resetAction = (dispatch: React.Dispatch<ActionType>) => {
  dispatch({ type: UserAction.RESET });
};
