'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useAuth } from '../../lib/hooks/useAuth';
import {
  AuthState,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
} from '../../lib/types/auth';

/**
 * Interfaz para respuestas de operaciones de autenticación
 */
interface AuthOperationResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

/**
 * Tipo del contexto de autenticación
 * Extiende AuthState y agrega las operaciones disponibles
 */
interface AuthContextType extends AuthState {
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
 * Contexto de autenticación
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del proveedor de autenticación
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor de contexto de autenticación
 * Envuelve la aplicación y proporciona el estado de autenticación
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => auth, [auth]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de autenticación
 * @returns Contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider. ' +
        'Make sure to wrap your component with <AuthProvider>.'
    );
  }

  return context;
};
