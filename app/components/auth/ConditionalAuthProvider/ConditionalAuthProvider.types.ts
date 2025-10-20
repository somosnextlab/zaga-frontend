import { ReactNode } from 'react';
import { AuthState, LoginFormData, RegisterFormData, ProfileFormData } from '../../../lib/auth/types/auth';

/**
 * Interfaz para respuestas de operaciones de autenticación
 */
export interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Tipo del contexto de autenticación
 * Extiende AuthState y agrega las operaciones disponibles
 */
export interface AuthContextType extends AuthState {
  // Operaciones de autenticación
  login: (formData: LoginFormData) => Promise<AuthOperationResult>;
  register: (formData: RegisterFormData) => Promise<AuthOperationResult>;
  registerInBackend: () => Promise<AuthOperationResult>;
  createProfile: (formData: ProfileFormData) => Promise<AuthOperationResult>;
  signOut: () => Promise<AuthOperationResult>;
  updateUserMetadata: (metadata: Record<string, unknown>) => Promise<void>;

  // Valores computados
  isAdmin: boolean;
  isCliente: boolean;
  isUsuario: boolean;
  canAccessDashboard: boolean;
}

/**
 * Props del proveedor de autenticación
 */
export interface ConditionalAuthProviderProps {
  children: ReactNode;
}
