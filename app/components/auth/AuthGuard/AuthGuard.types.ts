/**
 * Roles válidos para el guard de autenticación
 */
export type ValidRole = 'admin' | 'cliente' | 'usuario';

/**
 * Props del componente AuthGuard
 */
export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: ValidRole;
}
