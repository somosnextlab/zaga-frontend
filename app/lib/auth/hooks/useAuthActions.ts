'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { User } from '@supabase/supabase-js';
import {
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
} from '../types/auth';
import { ROUTES } from '../../constants/routes';
import { errorHandler, createAuthError } from '../../utils/errorHandler';
import {
  checkLoginRateLimit,
  getRateLimitInfo,
  recordLoginAttempt,
} from '../utils/rateLimiter';

/**
 * Interfaz para respuestas de operaciones de autenticación
 */
interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Hook específico para acciones de autenticación
 * No hace llamadas automáticas a Supabase, solo ejecuta acciones cuando se solicitan
 */
export const useAuthActions = () => {
  const router = useRouter();

  /**
   * Maneja el login del usuario
   * @param formData - Datos del formulario de login
   * @returns Promise con el resultado del login
   */
  const login = useCallback(
    async (formData: LoginFormData): Promise<AuthOperationResult> => {
      try {
        // Obtener IP del cliente (simulado para el frontend)
        const clientIP = 'unknown'; // En producción, esto vendría del servidor
        const userAgent = navigator.userAgent;

        // Verificar rate limiting
        if (!checkLoginRateLimit(formData.email, clientIP, userAgent)) {
          const rateLimitInfo = getRateLimitInfo(formData.email, clientIP);
          const resetTime = new Date(
            rateLimitInfo.resetTime
          ).toLocaleTimeString();

          return {
            success: false,
            error: `Demasiados intentos de inicio de sesión. Inténtalo de nuevo después de las ${resetTime}`,
          };
        }

        const result = await authService.login(formData);

        // Registrar intento (éxito o fallo)
        recordLoginAttempt(formData.email, result.success, clientIP, userAgent);

        if (result.success && result.user) {
          // Obtener el rol del usuario para redirección
          const role = result.user.app_metadata?.role;
          const redirectRoute =
            role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
          router.push(redirectRoute);

          return { success: true };
        } else {
          const authError = createAuthError(
            result.error || 'Error durante el inicio de sesión',
            { email: formData.email, timestamp: new Date().toISOString() }
          );

          errorHandler.logError(authError, 'useAuthActions.login');

          return {
            success: false,
            error: errorHandler.getUserMessage(authError),
          };
        }
      } catch (error) {
        const authError = createAuthError(
          'Error inesperado durante el inicio de sesión',
          {
            email: formData.email,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }
        );

        errorHandler.logError(authError, 'useAuthActions.login');

        return {
          success: false,
          error: errorHandler.getUserMessage(authError),
        };
      }
    },
    [router]
  );

  /**
   * Maneja el registro del usuario
   * @param formData - Datos del formulario de registro
   * @returns Promise con el resultado del registro
   */
  const register = useCallback(
    async (formData: RegisterFormData): Promise<AuthOperationResult> => {
      try {
        const result = await authService.register(formData);
        return result;
      } catch (error) {
        const authError = createAuthError(
          'Error inesperado durante el registro',
          {
            email: formData.email,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }
        );

        errorHandler.logError(authError, 'useAuthActions.register');

        return {
          success: false,
          error: errorHandler.getUserMessage(authError),
        };
      }
    },
    []
  );

  /**
   * Maneja el registro en el backend
   * @param user - Usuario a registrar en el backend
   * @returns Promise con el resultado del registro en backend
   */
  const registerInBackend = useCallback(
    async (user: User): Promise<AuthOperationResult> => {
      try {
        const result = await authService.registerInBackend(user);
        return result;
      } catch (error) {
        const authError = createAuthError(
          'Error inesperado durante el registro en backend',
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }
        );

        errorHandler.logError(authError, 'useAuthActions.registerInBackend');

        return {
          success: false,
          error: errorHandler.getUserMessage(authError),
        };
      }
    },
    []
  );

  /**
   * Crea el perfil del usuario
   * @param formData - Datos del formulario de perfil
   * @returns Promise con el resultado de la creación del perfil
   */
  const createProfile = useCallback(
    async (formData: ProfileFormData): Promise<AuthOperationResult> => {
      try {
        const result = await authService.createProfile(formData);
        return result;
      } catch (error) {
        const authError = createAuthError(
          'Error inesperado durante la creación del perfil',
          {
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
          }
        );

        errorHandler.logError(authError, 'useAuthActions.createProfile');

        return {
          success: false,
          error: errorHandler.getUserMessage(authError),
        };
      }
    },
    []
  );

  /**
   * Cierra la sesión
   * @returns Promise con el resultado del cierre de sesión
   */
  const signOut = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      const result = await authService.signOut();

      if (result.success) {
        router.push(ROUTES.LOGIN);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      const authError = createAuthError(
        'Error inesperado durante el cierre de sesión',
        {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      );

      errorHandler.logError(authError, 'useAuthActions.signOut');

      return {
        success: false,
        error: errorHandler.getUserMessage(authError),
      };
    }
  }, [router]);

  return {
    login,
    register,
    registerInBackend,
    createProfile,
    signOut,
  };
};
