'use client';

import { supabaseClient } from '../supabase/client';
import { apiPost, parseApiResponse } from '../../../lib/api';
import {
  User,
  UserRole,
  RegisterFormData,
  LoginFormData,
  ProfileFormData,
  BackendRegistrationResponse,
  ProfileCreationResponse,
  AuthState,
} from '../types/auth';
import {
  errorHandler,
  createAuthError,
  createValidationError,
} from '../utils/errorHandler';
import {
  validateEmail,
  validatePassword,
  sanitizeInput,
} from '../utils/validation';

/**
 * Interfaz para respuestas de autenticación
 */
interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  needsBackendRegistration?: boolean;
}

/**
 * Interfaz para respuestas de backend
 */
interface BackendResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Servicio de autenticación que maneja el flujo completo con Supabase y backend
 * Aplica principios SOLID: Single Responsibility, Open/Closed, Dependency Inversion
 */
export class AuthService {
  private readonly supabase = supabaseClient();

  /**
   * Obtiene la URL base para redirecciones
   * @returns URL base del sitio
   */
  private getBaseUrl(): string {
    // Priorizar la variable de entorno para producción
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }

    // En el cliente, usar la URL actual
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    // Fallback para desarrollo local
    return 'http://localhost:3000';
  }

  /**
   * Verifica si Supabase está configurado correctamente
   * @returns true si la configuración es válida
   */
  private isSupabaseConfigured(): boolean {
    try {
      const config = this.supabase;
      return !!config;
    } catch (error) {
      console.warn('Supabase not properly configured:', error);
      return false;
    }
  }

  /**
   * Registra un nuevo usuario en Supabase
   * @param formData - Datos del formulario de registro
   * @returns Promise con el resultado del registro
   */
  async register(
    formData: RegisterFormData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        return this.createErrorResult(
          'Servicio de autenticación no disponible'
        );
      }

      // Validar datos de entrada
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        const validationError = createValidationError(
          'email',
          emailValidation.error!
        );
        errorHandler.logError(validationError, 'AuthService.register');
        return this.createErrorResult(emailValidation.error!);
      }

      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        const validationError = createValidationError(
          'password',
          passwordValidation.error!
        );
        errorHandler.logError(validationError, 'AuthService.register');
        return this.createErrorResult(passwordValidation.error!);
      }

      // Sanitizar datos
      const sanitizedEmail = sanitizeInput(formData.email);

      const { data, error } = await this.supabase.auth.signUp({
        email: sanitizedEmail,
        password: formData.password,
        options: {
          emailRedirectTo: `${this.getBaseUrl()}/auth/verify-email`,
        },
      });

      if (error) {
        const authError = createAuthError(
          `Error de registro: ${error.message}`,
          { email: sanitizedEmail }
        );
        errorHandler.logError(authError, 'AuthService.register');
        return this.createErrorResult(error.message);
      }

      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          error: 'Por favor verifica tu email antes de continuar',
        };
      }

      return { success: true };
    } catch (error) {
      const authError = createAuthError(
        'Error inesperado durante el registro',
        {
          email: formData.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
      errorHandler.logError(authError, 'AuthService.register');
      return this.createErrorResult('Error inesperado durante el registro');
    }
  }

  /**
   * Inicia sesión y maneja el registro automático en el backend
   * @param formData - Datos del formulario de login
   * @returns Promise con el resultado del login
   */
  async login(formData: LoginFormData): Promise<AuthResult> {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        return this.createErrorResult(
          'Servicio de autenticación no disponible'
        );
      }

      // Sanitizar email
      const sanitizedEmail = sanitizeInput(formData.email);

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: formData.password,
      });

      if (error) {
        const authError = createAuthError(`Error de login: ${error.message}`, {
          email: sanitizedEmail,
        });
        errorHandler.logError(authError, 'AuthService.login');
        return this.createErrorResult(error.message);
      }

      if (!data.user) {
        const authError = createAuthError(
          'No se pudo obtener información del usuario',
          { email: sanitizedEmail }
        );
        errorHandler.logError(authError, 'AuthService.login');
        return this.createErrorResult(
          'No se pudo obtener información del usuario'
        );
      }

      // Validar email verificado
      const emailValidation = this.validateEmailVerification(data.user);
      if (!emailValidation.isValid) {
        return this.createErrorResult(emailValidation.error!);
      }

      // Manejar registro en backend si es necesario
      const backendResult = await this.handleBackendRegistration(data.user);
      if (!backendResult.success) {
        return {
          success: false,
          error: backendResult.error,
          needsBackendRegistration: true,
          user: data.user,
        };
      }

      return {
        success: true,
        user: data.user,
        needsBackendRegistration: false,
      };
    } catch (error) {
      const authError = createAuthError(
        'Error inesperado durante el inicio de sesión',
        {
          email: formData.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );
      errorHandler.logError(authError, 'AuthService.login');
      return this.createErrorResult(
        'Error inesperado durante el inicio de sesión'
      );
    }
  }

  /**
   * Registra el usuario en el backend después del login exitoso
   * @param user - Usuario a registrar en el backend
   * @returns Promise con el resultado del registro
   */
  async registerInBackend(user: User): Promise<BackendResult> {
    try {
      const response = await apiPost('/usuarios/registro-inicial');

      // Manejar respuesta 409 (usuario ya registrado)
      if (response.status === 409) {
        // Usuario ya registrado en el backend - comportamiento esperado
        if (process.env.NODE_ENV === 'development') {
          console.log(
            'User already registered in backend (409) - marking as registered'
          );
        }
        // Marcar inmediatamente como registrado para evitar loops
        await this.updateUserMetadata({ backend_registered: true });
        return { success: true };
      }

      // Manejar errores de respuesta
      if (!response.ok) {
        return this.handleBackendError(response);
      }

      // Procesar respuesta exitosa
      const result =
        await parseApiResponse<BackendRegistrationResponse>(response);

      if (result.success) {
        return { success: true };
      } else {
        const backendError = createAuthError(
          `Backend registration failed: ${result.message}`,
          { userId: user.id }
        );
        errorHandler.logError(backendError, 'AuthService.registerInBackend');
        return { success: false, error: result.message };
      }
    } catch (error) {
      const backendError = createAuthError('Error al registrar en el sistema', {
        userId: user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      errorHandler.logError(backendError, 'AuthService.registerInBackend');
      return {
        success: false,
        error: `Error al registrar en el sistema: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`,
      };
    }
  }

  /**
   * Crea el perfil completo del usuario
   * @param formData - Datos del formulario de perfil
   * @returns Promise con el resultado de la creación del perfil
   */
  async createProfile(formData: ProfileFormData): Promise<BackendResult> {
    try {
      const response = await apiPost('/usuarios/crear-perfil', formData);
      const result = await parseApiResponse<ProfileCreationResponse>(response);

      if (result.success) {
        // Actualizar metadata del usuario
        await this.updateUserProfileMetadata();
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error('Profile creation error:', error);
      return {
        success: false,
        error: 'Error al crear el perfil. Por favor, inténtalo de nuevo.',
      };
    }
  }

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        return null;
      }

      const {
        data: { user },
      } = await this.supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Obtiene el estado de autenticación completo
   * @returns Promise con el estado actual de autenticación
   */
  async getAuthState(): Promise<AuthState> {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        return this.createEmptyAuthState();
      }

      const user = await this.getCurrentUser();

      if (!user) {
        return this.createEmptyAuthState();
      }

      const role = this.getUserRole(user);
      const needsBackendRegistration = this.shouldRegisterInBackend(user, role);
      const needsProfileCompletion = !user.user_metadata?.profile_completed;

      return {
        user,
        role,
        isAuthenticated: true,
        isLoading: false,
        isInitializing: false,
        needsBackendRegistration,
        needsProfileCompletion,
      };
    } catch (error) {
      console.error('Get auth state error:', error);
      return this.createEmptyAuthState();
    }
  }

  /**
   * Cierra la sesión
   * @returns Promise con el resultado del cierre de sesión
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        return this.createErrorResult(
          'Servicio de autenticación no disponible'
        );
      }

      const { error } = await this.supabase.auth.signOut();

      if (error) {
        return this.createErrorResult(error.message);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return this.createErrorResult('Error al cerrar sesión');
    }
  }

  /**
   * Obtiene el rol del usuario
   * @param user - Usuario del cual obtener el rol
   * @returns Rol del usuario o null si no es válido
   */
  private getUserRole(user: User): UserRole | null {
    const role = user.user_metadata?.role;
    const validRoles: UserRole[] = ['admin', 'cliente', 'usuario'];
    return validRoles.includes(role as UserRole) ? (role as UserRole) : null;
  }

  /**
   * Actualiza los metadatos del usuario
   * @param metadata - Metadatos a actualizar
   */
  async updateUserMetadata(metadata: Record<string, unknown>): Promise<void> {
    try {
      await this.supabase.auth.updateUser({
        data: metadata,
      });
    } catch (error) {
      console.error('Update user metadata error:', error);
    }
  }

  /**
   * Escucha cambios en el estado de autenticación
   * @param callback - Función a ejecutar cuando cambie el estado
   * @returns Función para desuscribirse
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    try {
      // Verificar configuración de Supabase
      if (!this.isSupabaseConfigured()) {
        // Retornar función de desuscripción vacía si no está configurado
        return { data: { subscription: { unsubscribe: () => {} } } };
      }

      return this.supabase.auth.onAuthStateChange((_, session) => {
        callback(session?.user ?? null);
      });
    } catch (error) {
      console.warn('Auth state change listener error:', error);
      // Retornar función de desuscripción vacía en caso de error
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  }

  // ==================== MÉTODOS HELPER ====================

  /**
   * Crea un resultado de error estandarizado
   * @param message - Mensaje de error
   * @returns Resultado de error
   */
  private createErrorResult(message: string): {
    success: false;
    error: string;
  } {
    return { success: false, error: message };
  }

  /**
   * Valida si el email del usuario está verificado
   * @param user - Usuario a validar
   * @returns Resultado de la validación
   */
  private validateEmailVerification(user: User): {
    isValid: boolean;
    error?: string;
  } {
    if (!user.email_confirmed_at) {
      return {
        isValid: false,
        error: 'Por favor verifica tu email antes de continuar',
      };
    }
    return { isValid: true };
  }

  /**
   * Maneja el registro en backend si es necesario
   * @param user - Usuario a procesar
   * @returns Resultado del procesamiento
   */
  private async handleBackendRegistration(user: User): Promise<BackendResult> {
    const userRole = user.user_metadata?.role;
    const isAdmin = userRole === 'admin';
    const needsBackendRegistration =
      !isAdmin && !user.user_metadata?.backend_registered;

    if (!needsBackendRegistration) {
      return { success: true };
    }

    // El método registerInBackend ya maneja la actualización del flag backend_registered
    return await this.registerInBackend(user);
  }

  /**
   * Determina si el usuario necesita registro en backend
   * @param user - Usuario a evaluar
   * @param role - Rol del usuario
   * @returns true si necesita registro en backend
   */
  private shouldRegisterInBackend(user: User, role: UserRole | null): boolean {
    const isAdmin = role === 'admin';
    return !isAdmin && !user.user_metadata?.backend_registered;
  }

  /**
   * Crea un estado de autenticación vacío
   * @returns Estado de autenticación vacío
   */
  private createEmptyAuthState(): AuthState {
    return {
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      isInitializing: false,
      needsBackendRegistration: false,
      needsProfileCompletion: false,
    };
  }

  /**
   * Actualiza los metadatos del usuario después de crear perfil
   */
  private async updateUserProfileMetadata(): Promise<void> {
    const user = await this.getCurrentUser();
    if (user) {
      await this.updateUserMetadata({
        profile_completed: true,
        role: 'cliente',
      });
    }
  }

  /**
   * Maneja errores de respuesta del backend
   * @param response - Respuesta del backend
   * @returns Resultado del error
   */
  private async handleBackendError(response: Response): Promise<BackendResult> {
    const errorText = await response.text();

    const backendError = createAuthError(`Backend error: ${response.status}`, {
      status: response.status,
      errorText: errorText.substring(0, 200), // Truncar para evitar logs largos
    });
    errorHandler.logError(backendError, 'AuthService.handleBackendError');

    const errorMessages: Record<number, string> = {
      401: 'Token de autorización inválido. Por favor, inicia sesión nuevamente.',
      500: 'Error del servidor. Por favor, inténtalo más tarde.',
    };

    const errorMessage =
      errorMessages[response.status] ||
      `Error del servidor (${response.status}): ${errorText}`;

    return { success: false, error: errorMessage };
  }
}

// Instancia singleton del servicio
export const authService = new AuthService();
