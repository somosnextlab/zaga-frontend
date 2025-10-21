'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/hooks/useAuth';
import { ROUTES } from '../../../lib/constants/routes';
import './AuthGuard.module.scss';
import { BackendRegistrationHandler } from '../BackendRegistrationHandler/BackendRegistrationHandler';

/**
 * Roles válidos para el guard de autenticación
 */
type ValidRole = 'admin' | 'cliente' | 'usuario';

/**
 * Props del componente AuthGuard
 */
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: ValidRole;
}

/**
 * Componente que protege rutas basándose en el estado de autenticación
 * Aplica principios de seguridad y control de acceso
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requireRole,
}) => {
  const router = useRouter();
  const {
    isAuthenticated,
    role,
    isLoading,
    isInitializing,
    needsBackendRegistration,
    needsProfileCompletion,
  } = useAuth();

  // ==================== MÉTODOS HELPER ====================

  /**
   * Obtiene la ruta de redirección según el rol del usuario
   * @param userRole - Rol del usuario
   * @returns Ruta de redirección apropiada
   */
  const getRedirectRoute = useMemo(() => {
    return (userRole: string | null): string => {
      switch (userRole) {
        case 'admin':
          return ROUTES.ADMIN_DASHBOARD;
        case 'cliente':
        case 'usuario':
          return ROUTES.USER_DASHBOARD;
        default:
          return ROUTES.LOGIN;
      }
    };
  }, []);

  /**
   * Verifica si el usuario tiene el rol requerido
   * @param userRole - Rol del usuario
   * @param requiredRole - Rol requerido
   * @returns true si el usuario tiene el rol requerido
   */
  const hasRequiredRole = useMemo(() => {
    return (userRole: string | null, requiredRole?: ValidRole): boolean => {
      if (!requiredRole) return true;
      return userRole === requiredRole;
    };
  }, []);

  // ==================== EFECTOS ====================

  useEffect(() => {
    // No hacer nada si aún está inicializando
    if (isInitializing) {
      return;
    }

    // Si no requiere autenticación, permitir acceso
    if (!requireAuth) {
      return;
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN);
      return;
    }

    // Si requiere un rol específico y el usuario no lo tiene
    if (!hasRequiredRole(role, requireRole)) {
      const redirectRoute = getRedirectRoute(role);
      router.push(redirectRoute);
      return;
    }

    // Si necesita registro en el backend, mostrar el handler
    if (needsBackendRegistration) {
      return;
    }

    // Si necesita completar el perfil, permitir acceso al dashboard normal
    // El dashboard se encargará de mostrar las funcionalidades apropiadas según el rol
  }, [
    isInitializing,
    requireAuth,
    isAuthenticated,
    role,
    requireRole,
    needsBackendRegistration,
    needsProfileCompletion,
    router,
    hasRequiredRole,
    getRedirectRoute,
  ]);

  // ==================== COMPONENTES DE RENDERIZADO ====================

  /**
   * Componente de loading
   */
  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando...</p>
      </div>
    </div>
  );

  /**
   * Componente de handler de registro en backend
   */
  const BackendRegistrationComponent = () => (
    <BackendRegistrationHandler
      onComplete={() => {
        // El hook se encargará de actualizar el estado
      }}
      onError={error => {
        console.error('Backend registration error:', error);
      }}
    />
  );

  // ==================== LÓGICA DE RENDERIZADO ====================

  // Mostrar loading mientras inicializa
  if (isInitializing || isLoading) {
    return <LoadingSpinner />;
  }

  // Si no requiere autenticación, mostrar contenido
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  // Si necesita registro en el backend, mostrar el handler
  if (needsBackendRegistration) {
    return <BackendRegistrationComponent />;
  }

  // Si necesita completar el perfil, permitir acceso al dashboard normal
  // El dashboard se encargará de mostrar las funcionalidades apropiadas según el rol

  // Mostrar contenido normal
  return <>{children}</>;
};
