// ==================== TIPOS BASE ====================

/**
 * Roles válidos en el sistema
 */
export type UserRole = 'admin' | 'cliente' | 'usuario';

/**
 * Tipos de documento válidos
 */
export type DocumentType = 'DNI' | 'PASAPORTE' | 'CEDULA';

/**
 * Estados de autenticación
 */
export type AuthStatus =
  | 'authenticated'
  | 'unauthenticated'
  | 'loading'
  | 'initializing';

// ==================== INTERFACES DE USUARIO ====================

/**
 * Metadatos del usuario almacenados en Supabase
 */
export interface UserMetadata {
  role?: UserRole;
  email_verified?: boolean;
  backend_registered?: boolean;
  profile_completed?: boolean;
}

/**
 * Usuario autenticado con información de rol
 */
export interface AuthUser {
  user: import('@supabase/supabase-js').User | null;
  role: UserRole | null;
}

// ==================== INTERFACES DE FORMULARIOS ====================

/**
 * Datos del formulario de login (inferido de Zod)
 */
export type { LoginFormData, RegisterFormData, ProfileFormData, ChangePasswordFormData } from '../schemas/auth';

/**
 * Datos del formulario de perfil extendido (para el backend)
 */
export interface ExtendedProfileFormData {
  tipo_doc: DocumentType;
  numero_doc: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nac: string;
}

// ==================== INTERFACES DE ESTADO ====================

/**
 * Estado completo de autenticación
 */
export interface AuthState {
  user: import('@supabase/supabase-js').User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  needsBackendRegistration: boolean;
  needsProfileCompletion: boolean;
}

// ==================== INTERFACES DE RESPUESTAS ====================

/**
 * Respuesta base para operaciones de autenticación
 */
export interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Respuesta del registro inicial en el backend
 */
export interface BackendRegistrationResponse {
  success: boolean;
  message: string;
}

/**
 * Respuesta de la creación de perfil
 */
export interface ProfileCreationResponse {
  success: boolean;
  message: string;
  data?: {
    persona_id: string;
    cliente_id: string;
  };
}

/**
 * Respuesta del endpoint de rol de usuario desde el backend
 */
export interface UserRoleResponse {
  success: boolean;
  role: UserRole;
}

// ==================== TIPOS DE UTILIDAD ====================

/**
 * Configuración de roles para componentes
 */
export interface RoleConfig {
  badgeClass: string;
  badgeText: string;
  welcomeMessage: string;
}

/**
 * Props comunes para componentes de autenticación
 */
export interface AuthComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Callback para operaciones de autenticación
 */
export type AuthCallback = (result: AuthOperationResult) => void;
