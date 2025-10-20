'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../../lib/auth/hooks/useAuth';
import {
  AuthState,
  LoginFormData,
  RegisterFormData,
  ProfileFormData,
} from '../../../lib/auth/types/auth';
import { ROUTES } from '../../../lib/constants/routes';
import './ConditionalAuthProvider.module.scss';

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
interface ConditionalAuthProviderProps {
  children: ReactNode;
}

/**
 * Rutas que requieren autenticación completa
 */
const AUTH_REQUIRED_ROUTES = [
  ROUTES.USER_DASHBOARD,
  ROUTES.ADMIN_DASHBOARD,
  '/prestamos',
  '/profile',
  '/settings',
];

/**
 * Rutas de autenticación (login, register, etc.)
 */
const AUTH_PAGES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  '/auth/verify-email',
  '/auth/signout',
];

/**
 * Determina si la ruta actual requiere autenticación completa
 */
const requiresFullAuth = (pathname: string): boolean => {
  return AUTH_REQUIRED_ROUTES.some(
    route => pathname === route || pathname.startsWith(route)
  );
};

/**
 * Determina si la ruta actual es una página de autenticación
 */
const isAuthPage = (pathname: string): boolean => {
  return AUTH_PAGES.some(
    route => pathname === route || pathname.startsWith(route)
  );
};

/**
 * Estado de autenticación mínimo para páginas de auth
 */
const MINIMAL_AUTH_STATE: AuthContextType = {
  // Estado básico
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: false,
  needsBackendRegistration: false,
  needsProfileCompletion: false,

  // Operaciones básicas (solo las necesarias para login/register)
  login: async () => ({ success: false, error: 'Auth not initialized' }),
  register: async () => ({ success: false, error: 'Auth not initialized' }),
  registerInBackend: async () => ({
    success: false,
    error: 'Auth not initialized',
  }),
  createProfile: async () => ({
    success: false,
    error: 'Auth not initialized',
  }),
  signOut: async () => ({ success: false, error: 'Auth not initialized' }),
  updateUserMetadata: async () => {},

  // Valores computados
  isAdmin: false,
  isCliente: false,
  isUsuario: false,
  canAccessDashboard: false,
};

/**
 * Proveedor de contexto de autenticación condicional
 * Solo inicializa la autenticación completa cuando es necesario
 */
export const ConditionalAuthProvider: React.FC<
  ConditionalAuthProviderProps
> = ({ children }) => {
  const pathname = usePathname();

  // Determinar si necesitamos autenticación completa
  const needsFullAuth = requiresFullAuth(pathname);
  const isAuthPageRoute = isAuthPage(pathname);

  // Siempre llamar useAuth, pero solo usar su valor cuando sea necesario
  const auth = useAuth();

  // Memoizar el valor del contexto
  const contextValue = useMemo(() => {

    // Si necesitamos autenticación completa, usar el hook completo
    if (needsFullAuth) {
      return auth;
    }

    // Para páginas de auth, usar estado mínimo
    if (isAuthPageRoute) {
      return MINIMAL_AUTH_STATE;
    }

    // Para la landing page, usar el estado de autenticación real si hay sesión activa
    // Esto permite mostrar el botón "Ir a dashboard" cuando el usuario está autenticado
    if (pathname === '/') {
      return auth;
    }

    // Para otras páginas públicas, usar estado básico
    return MINIMAL_AUTH_STATE;
  }, [needsFullAuth, auth, isAuthPageRoute, pathname]);

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
      'useAuthContext must be used within a ConditionalAuthProvider. ' +
        'Make sure to wrap your component with <ConditionalAuthProvider>.'
    );
  }

  return context;
};
