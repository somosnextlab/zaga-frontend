import { User } from '@supabase/supabase-js';
import { UserRole } from '../types/auth';
import { ROUTES } from '../../constants/routes';

/**
 * Obtiene el rol del usuario desde app_metadata
 * @param user - Usuario de Supabase o null
 * @returns Rol del usuario ('admin' o 'cliente')
 */
export const getUserRole = (user: User | null): UserRole => {
  const role = user?.app_metadata?.role;
  return role === 'admin' ? 'admin' : 'cliente';
};

/**
 * Obtiene la ruta del dashboard según el rol del usuario
 * @param role - Rol del usuario
 * @returns Ruta del dashboard correspondiente
 */
export const getDashboardRoute = (role: UserRole): string => {
  return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
};

/**
 * Verifica si una ruta es protegida (requiere autenticación)
 * @param pathname - Ruta a verificar
 * @returns true si la ruta es protegida
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return (
    pathname === ROUTES.USER_DASHBOARD ||
    pathname === ROUTES.ADMIN_DASHBOARD ||
    pathname.startsWith('/prestamos')
  );
};

/**
 * Verifica si una ruta es de administración
 * @param pathname - Ruta a verificar
 * @returns true si la ruta es de admin
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname === ROUTES.ADMIN_DASHBOARD;
};

/**
 * Verifica si una ruta es privada (solo para clientes)
 * @param pathname - Ruta a verificar
 * @returns true si la ruta es privada
 */
export const isPrivateRoute = (pathname: string): boolean => {
  return pathname === ROUTES.USER_DASHBOARD;
};
