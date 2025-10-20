'use client';

import { supabaseClient } from '../../supabase/client';
import { User } from '@supabase/supabase-js';
import {
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
} from '../../utils/errorHandler';
import { sessionService } from './sessionService';
import { apiPost, parseApiResponse } from '@/app/api';
import { sanitizeInput } from '../schemas/auth';
import { validateEmail, validatePassword } from '../utils/validation';

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

  constructor() {
    // Configurar limpieza automática de sesión
    sessionService.setupSessionCleanup();
  }

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
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!url || !anonKey || url === 'https://placeholder.supabase.co') {
        return false;
      }
      
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

      // Persistir tokens de sesión
      this.persistSessionTokens(data.session);

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

      // Procesar respuesta exitosa
      const result = await parseApiResponse<BackendRegistrationResponse>(
        response
      );

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
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Determinar si es un error que debe generar reintentos automáticos
      const isRetryableError =
        errorMessage.includes('fetch') ||
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('ENOTFOUND');

      const backendError = createAuthError('Error al registrar en el sistema', {
        userId: user.id,
        error: errorMessage,
        isRetryable: isRetryableError,
      });
      errorHandler.logError(backendError, 'AuthService.registerInBackend');

      return {
        success: false,
        error: isRetryableError
          ? 'Error de conexión. Reintentando automáticamente...'
          : `Error al registrar en el sistema: ${errorMessage}`,
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

      // Primero intentar recuperar de la sesión persistente
      const persistedUser = this.getPersistedUser();
      if (persistedUser && sessionService.isSessionValid()) {
        return persistedUser;
      }

      // Si no hay sesión persistente válida, obtener de Supabase
      const {
        data: { user },
      } = await this.supabase.auth.getUser();

      // Si hay usuario, persistir la sesión
      if (user) {
        this.persistUserData(user);
      }

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

      const role = await this.getUserRole(user);
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

      // Limpiar datos de sesión persistente
      sessionService.clearSession();

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
  private async getUserRole(user: User): Promise<UserRole | null> {
    const supabaseRole = user.app_metadata?.role;
    const validRoles: UserRole[] = ['admin', 'cliente', 'usuario'];

    // Si es admin (asignado en Supabase), usar ese rol
    if (supabaseRole === 'admin') {
      return 'admin';
    }

    // Para otros usuarios, consultar el backend a través del nuevo endpoint
    try {
      // Obtener el token de acceso de la sesión
      const accessToken = sessionService.getAccessToken();
      if (!accessToken) {
        console.error('getUserRole: No hay token de acceso disponible');
        return null;
      }

      const response = await fetch('/api/usuarios/rol-usuarios', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error obteniendo rol desde backend:', response.status);
        return null;
      }

      const data = await response.json();

      if (data.success && validRoles.includes(data.role)) {
        return data.role as UserRole;
      }

      console.warn('getUserRole: Rol no válido desde backend:', data.role);
      return null;
    } catch (error) {
      console.error('Error consultando rol desde backend:', error);
      return null;
    }
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
    const userRole = user.app_metadata?.role;
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


  // ==================== MÉTODOS DE PERSISTENCIA DE SESIÓN ====================

  /**
   * Persiste los tokens de sesión en el almacenamiento local
   * @param session - Sesión de Supabase con tokens
   */
  private persistSessionTokens(session: {
    access_token: string;
    refresh_token: string;
    expires_in?: number;
  }): void {
    if (!session?.access_token || !session?.refresh_token) {
      console.warn('No se pueden persistir tokens: sesión inválida');
      return;
    }

    try {
      // Calcular tiempo de expiración (Supabase usa 3600 segundos por defecto)
      const expiresIn = session.expires_in || 3600;

      // Persistir access token en localStorage
      sessionService.setAccessToken(session.access_token, expiresIn);

      // Persistir refresh token en httpOnly cookie
      sessionService.setRefreshToken(session.refresh_token, 2592000); // 30 días

      if (process.env.NODE_ENV === 'development') {
        console.log('Tokens de sesión persistidos correctamente');
      }
    } catch (error) {
      console.error('Error al persistir tokens de sesión:', error);
    }
  }

  /**
   * Persiste los datos del usuario en el almacenamiento local
   * @param user - Usuario a persistir
   */
  private persistUserData(user: User): void {
    try {
      const userData = {
        id: user.id,
        email: user.email,
        role: user.app_metadata?.role,
        email_verified: user.email_confirmed_at ? true : false,
        backend_registered: user.user_metadata?.backend_registered || false,
        profile_completed: user.user_metadata?.profile_completed || false,
        last_sign_in: user.last_sign_in_at,
        created_at: user.created_at,
      };

      sessionService.setUserData(userData);
    } catch (error) {
      console.error('Error al persistir datos del usuario:', error);
    }
  }

  /**
   * Obtiene el usuario persistido del almacenamiento local
   * @returns Usuario persistido o null si no existe
   */
  private getPersistedUser(): User | null {
    try {
      const userData = sessionService.getUserData();
      if (!userData) return null;

      // Reconstruir objeto User básico para compatibilidad
      const user: Partial<User> = {
        id: userData.id as string,
        email: userData.email as string,
        app_metadata: {
          role: userData.role as string,
        },
        user_metadata: {
          backend_registered: userData.backend_registered as boolean,
          profile_completed: userData.profile_completed as boolean,
        },
        email_confirmed_at: userData.email_verified
          ? new Date().toISOString()
          : undefined,
        last_sign_in_at: userData.last_sign_in as string,
        created_at: userData.created_at as string,
      };

      return user as User;
    } catch (error) {
      console.error('Error al obtener usuario persistido:', error);
      return null;
    }
  }

  /**
   * Intenta renovar la sesión usando el refresh token
   * @returns Promise con el resultado de la renovación
   */
  async refreshSession(): Promise<{ success: boolean; error?: string }> {
    try {
      const refreshToken = sessionService.getRefreshToken();
      if (!refreshToken) {
        return this.createErrorResult('No hay refresh token disponible');
      }

      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        // Si el refresh token es inválido, limpiar la sesión
        sessionService.clearSession();
        return this.createErrorResult(
          'Sesión expirada. Por favor, inicia sesión nuevamente'
        );
      }

      if (data.session) {
        // Persistir nuevos tokens
        this.persistSessionTokens(data.session);

        // Actualizar datos del usuario si hay cambios
        if (data.user) {
          this.persistUserData(data.user);
        }

        return { success: true };
      }

      return this.createErrorResult('No se pudo renovar la sesión');
    } catch (error) {
      console.error('Error al renovar sesión:', error);
      sessionService.clearSession();
      return this.createErrorResult('Error al renovar la sesión');
    }
  }

  /**
   * Verifica si la sesión actual es válida y la renueva si es necesario
   * @returns Promise con el estado de la sesión
   */
  async validateAndRefreshSession(): Promise<{
    isValid: boolean;
    needsRefresh: boolean;
  }> {
    try {
      // Verificar si la sesión actual es válida
      if (sessionService.isSessionValid()) {
        return { isValid: true, needsRefresh: false };
      }

      // Intentar renovar la sesión
      const refreshResult = await this.refreshSession();
      if (refreshResult.success) {
        return { isValid: true, needsRefresh: true };
      }

      return { isValid: false, needsRefresh: false };
    } catch (error) {
      console.error('Error al validar sesión:', error);
      return { isValid: false, needsRefresh: false };
    }
  }
}

// Instancia singleton del servicio
export const authService = new AuthService();
