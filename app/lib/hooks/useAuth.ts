'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import {
  AuthState,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
} from '../types/auth';
import { ROUTES } from '../constants/routes';
import { errorHandler, createAuthError } from '../utils/errorHandler';

/**
 * Interfaz para respuestas de operaciones de autenticación
 */
interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Estado inicial de autenticación
 */
const INITIAL_AUTH_STATE: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  needsBackendRegistration: false,
  needsProfileCompletion: false,
};

/**
 * Hook personalizado para manejar el estado de autenticación
 * Aplica principios SOLID y mejores prácticas de React
 */
export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>(INITIAL_AUTH_STATE);

  // ==================== MÉTODOS HELPER ====================

  /**
   * Actualiza el estado de autenticación de forma segura
   * @param updates - Actualizaciones parciales del estado
   */
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Maneja errores de operaciones de autenticación
   * @param error - Error capturado
   * @param operation - Nombre de la operación
   * @returns Resultado de error estandarizado
   */
  const handleAuthError = useCallback(
    (error: unknown, operation: string): AuthOperationResult => {
      const authError = createAuthError(
        `Error inesperado durante ${operation}`,
        {
          operation,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
      errorHandler.logError(authError, `useAuth.${operation}`);

      return {
        success: false,
        error: errorHandler.getUserMessage(authError),
      };
    },
    []
  );

  /**
   * Resetea el estado a su valor inicial
   */
  const resetAuthState = useCallback(() => {
    setAuthState(INITIAL_AUTH_STATE);
  }, []);

  /**
   * Obtiene la ruta de redirección según el rol del usuario
   * @param role - Rol del usuario
   * @returns Ruta de redirección
   */
  const getRedirectRoute = useCallback((role: string | null): string => {
    return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
  }, []);

  // ==================== MÉTODOS PRINCIPALES ====================

  /**
   * Inicializa el estado de autenticación
   */
  const initializeAuth = useCallback(async (): Promise<void> => {
    try {
      updateAuthState({ isInitializing: true, isLoading: false });

      // Agregar timeout para evitar que se quede cargando indefinidamente
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Auth initialization timeout')),
          3000
        );
      });

      const statePromise = authService.getAuthState();
      const state = await Promise.race([statePromise, timeoutPromise]);

      updateAuthState({ ...state, isInitializing: false, isLoading: false });
    } catch (error) {
      const authError = createAuthError(
        'Error durante la inicialización de autenticación',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
      errorHandler.logError(authError, 'useAuth.initializeAuth');

      updateAuthState({
        isInitializing: false,
        isLoading: false,
      });
    }
  }, [updateAuthState]);

  /**
   * Maneja el login del usuario
   * @param formData - Datos del formulario de login
   * @returns Promise con el resultado del login
   */
  const login = useCallback(
    async (formData: LoginFormData): Promise<AuthOperationResult> => {
      try {
        updateAuthState({ isLoading: true });

        const result = await authService.login(formData);

        if (result.success && result.user) {
          const newState = await authService.getAuthState();
          updateAuthState({ ...newState, isLoading: false });

          // Redirigir según el rol
          const redirectRoute = getRedirectRoute(newState.role);
          router.push(redirectRoute);

          return { success: true };
        } else {
          updateAuthState({ isLoading: false });
          return { success: false, error: result.error };
        }
      } catch (error) {
        updateAuthState({ isLoading: false });
        return handleAuthError(error, 'el inicio de sesión');
      }
    },
    [router, updateAuthState, getRedirectRoute, handleAuthError]
  );

  /**
   * Maneja el registro del usuario
   * @param formData - Datos del formulario de registro
   * @returns Promise con el resultado del registro
   */
  const register = useCallback(
    async (formData: RegisterFormData): Promise<AuthOperationResult> => {
      try {
        updateAuthState({ isLoading: true });

        const result = await authService.register(formData);
        updateAuthState({ isLoading: false });

        return result;
      } catch (error) {
        updateAuthState({ isLoading: false });
        return handleAuthError(error, 'el registro');
      }
    },
    [updateAuthState, handleAuthError]
  );

  /**
   * Maneja el registro en el backend
   * @returns Promise con el resultado del registro en backend
   */
  const registerInBackend =
    useCallback(async (): Promise<AuthOperationResult> => {
      try {
        updateAuthState({ isLoading: true });

        const user = await authService.getCurrentUser();
        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const result = await authService.registerInBackend(user);

        if (result.success) {
          const newState = await authService.getAuthState();
          updateAuthState({ ...newState, isLoading: false });
          return { success: true };
        } else {
          updateAuthState({ isLoading: false });
          return { success: false, error: result.error };
        }
      } catch (error) {
        updateAuthState({ isLoading: false });
        return handleAuthError(error, 'el registro en el sistema');
      }
    }, [updateAuthState, handleAuthError]);

  /**
   * Crea el perfil del usuario
   * @param formData - Datos del formulario de perfil
   * @returns Promise con el resultado de la creación del perfil
   */
  const createProfile = useCallback(
    async (formData: ProfileFormData): Promise<AuthOperationResult> => {
      try {
        updateAuthState({ isLoading: true });

        const result = await authService.createProfile(formData);

        if (result.success) {
          const newState = await authService.getAuthState();
          updateAuthState({ ...newState, isLoading: false });
          return { success: true, data: result.data };
        } else {
          updateAuthState({ isLoading: false });
          return { success: false, error: result.error };
        }
      } catch (error) {
        updateAuthState({ isLoading: false });
        return handleAuthError(error, 'la creación del perfil');
      }
    },
    [updateAuthState, handleAuthError]
  );

  /**
   * Cierra la sesión
   * @returns Promise con el resultado del cierre de sesión
   */
  const signOut = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      updateAuthState({ isLoading: true });

      const result = await authService.signOut();

      if (result.success) {
        resetAuthState();
        router.push(ROUTES.LOGIN);
        return { success: true };
      } else {
        updateAuthState({ isLoading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      updateAuthState({ isLoading: false });
      return handleAuthError(error, 'el cierre de sesión');
    }
  }, [router, updateAuthState, resetAuthState, handleAuthError]);

  /**
   * Actualiza los metadatos del usuario
   * @param metadata - Metadatos a actualizar
   */
  const updateUserMetadata = useCallback(
    async (metadata: Record<string, unknown>): Promise<void> => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          await authService.updateUserMetadata(metadata);

          // Actualizar el estado local
          const newState = await authService.getAuthState();
          updateAuthState(newState);
        }
      } catch (error) {
        console.error('Update user metadata error:', error);
      }
    },
    [updateAuthState]
  );

  // ==================== EFECTOS ====================

  // Inicializar autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async user => {
      if (user) {
        const newState = await authService.getAuthState();
        updateAuthState(newState);
      } else {
        resetAuthState();
      }
    });

    return () => subscription.unsubscribe();
  }, [updateAuthState, resetAuthState]);

  // ==================== VALORES MEMOIZADOS ====================

  /**
   * Valores computados del estado de autenticación
   */
  const computedValues = useMemo(
    () => ({
      isAdmin: authState.role === 'admin',
      isCliente: authState.role === 'cliente',
      isUsuario: authState.role === 'usuario',
      canAccessDashboard: authState.isAuthenticated && !authState.isLoading,
      needsBackendRegistration: authState.needsBackendRegistration,
      needsProfileCompletion: authState.needsProfileCompletion,
    }),
    [authState]
  );

  /**
   * API pública del hook
   */
  const api = useMemo(
    () => ({
      // Estado
      ...authState,
      ...computedValues,

      // Acciones
      login,
      register,
      registerInBackend,
      createProfile,
      signOut,
      updateUserMetadata,
    }),
    [
      authState,
      computedValues,
      login,
      register,
      registerInBackend,
      createProfile,
      signOut,
      updateUserMetadata,
    ]
  );

  return api;
};
