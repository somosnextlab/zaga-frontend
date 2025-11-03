/**
 * Estado del contexto de usuario
 */
export interface UserContextState {
  /**
   * Rol del usuario autenticado
   */
  role: string | null;
  /**
   * Estado de carga para obtener el rol
   */
  loading: boolean;
}

/**
 * Acciones del reducer de usuario
 */
export type UserContextAction =
  | { type: "SET_ROLE"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" };

/**
 * Tipo del contexto de usuario
 */
export interface UserContextType extends UserContextState {
  /**
   * Establece el rol del usuario
   */
  setRole: (role: string | null) => void;
  /**
   * Establece el estado de carga
   */
  setLoading: (loading: boolean) => void;
  /**
   * Resetea el estado del contexto
   */
  reset: () => void;
}
