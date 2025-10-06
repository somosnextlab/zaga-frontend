import { User } from "@supabase/supabase-js";
import { ROUTES } from "../constants/routes";
import { UserRole } from "../types/auth";


/**
 * Obtiene el rol del usuario desde user_metadata
 * @param user - Usuario de Supabase o null
 * @returns Rol del usuario ('admin' o 'cliente')
 */
export const getUserRole = (user: User | null): UserRole => {
  const role = user?.user_metadata?.role;
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
  return pathname.startsWith('/(private)') || pathname.startsWith('/(admin)');
};

/**
 * Verifica si una ruta es de administración
 * @param pathname - Ruta a verificar
 * @returns true si la ruta es de admin
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith('/(admin)');
};

/**
 * Verifica si una ruta es privada (solo para clientes)
 * @param pathname - Ruta a verificar
 * @returns true si la ruta es privada
 */
export const isPrivateRoute = (pathname: string): boolean => {
  return pathname.startsWith('/(private)');
};
