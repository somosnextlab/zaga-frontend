import React, { useMemo } from 'react';
import './DashboardLayout.module.scss';

/**
 * Roles válidos para el dashboard
 */
type DashboardRole = 'admin' | 'cliente' | 'usuario';

/**
 * Configuración de roles para el dashboard
 */
interface RoleConfig {
  badgeClass: string;
  badgeText: string;
  welcomeMessage: string;
}

/**
 * Props del componente DashboardLayout
 */
interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  userEmail?: string;
  role: DashboardRole;
  children: React.ReactNode;
}

/**
 * Componente de layout principal para dashboards
 * Proporciona una estructura consistente para diferentes tipos de dashboards
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  userEmail,
  role,
  children,
}) => {
  // ==================== CONFIGURACIÓN DE ROLES ====================

  /**
   * Configuración de estilos y textos para cada rol
   */
  const roleConfigurations = useMemo(
    (): Record<DashboardRole, RoleConfig> => ({
      admin: {
        badgeClass: 'bg-purple-100 text-purple-800',
        badgeText: 'Admin',
        welcomeMessage:
          'Desde aquí puedes gestionar todos los aspectos del sistema Zaga.',
      },
      cliente: {
        badgeClass: 'bg-blue-100 text-blue-800',
        badgeText: 'Cliente',
        welcomeMessage:
          'Desde aquí puedes ver el estado de tus préstamos y realizar pagos.',
      },
      usuario: {
        badgeClass: 'bg-yellow-100 text-yellow-800',
        badgeText: 'Usuario',
        welcomeMessage:
          'Bienvenido a Zaga. Completa tu perfil para acceder a todas las funcionalidades.',
      },
    }),
    []
  );

  /**
   * Configuración del rol actual
   */
  const currentRoleConfig = useMemo(() => {
    return roleConfigurations[role] || roleConfigurations.usuario;
  }, [role, roleConfigurations]);

  // ==================== COMPONENTES DE RENDERIZADO ====================

  /**
   * Componente del header del dashboard
   */
  const DashboardHeader = () => (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${currentRoleConfig.badgeClass}`}
            >
              {currentRoleConfig.badgeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Componente de bienvenida del usuario
   */
  const UserWelcomeCard = () => {
    if (!userEmail) return null;

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Bienvenido, {userEmail}
        </h2>
        <p className="text-gray-600">{currentRoleConfig.welcomeMessage}</p>
      </div>
    );
  };

  /**
   * Componente del contenido principal
   */
  const DashboardContent = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid gap-6">
        <UserWelcomeCard />
        {children}
      </div>
    </div>
  );

  // ==================== RENDERIZADO PRINCIPAL ====================

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <DashboardContent />
    </div>
  );
};
