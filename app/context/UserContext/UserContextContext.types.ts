export enum UserAction {
  SET_ROLE = "SET_ROLE",
  SET_LOADING = "SET_LOADING",
  RESET = "RESET",
}

export type UserContextStateType = {
  role: string | null;
  loading: boolean;
};

export type UserContextActions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: (payload?: any) => void;
};

export type ActionType = {
  type: UserAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
};

/**
 * Contexto de usuario
 */

export type UserContextType = {
  state: UserContextStateType;
  actions: UserContextActions;
};
