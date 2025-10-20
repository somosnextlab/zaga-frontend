/**
 * Roles válidos para el dashboard
 */
export type DashboardRole = 'admin' | 'cliente' | 'usuario';

/**
 * Configuración de roles para el dashboard
 */
export interface RoleConfig {
  badgeClass: string;
  badgeText: string;
  welcomeMessage: string;
}

/**
 * Props del componente DashboardLayout
 */
export interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  userEmail?: string;
  role: DashboardRole;
  children: React.ReactNode;
}
