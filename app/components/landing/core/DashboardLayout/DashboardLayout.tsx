import React from "react";
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

const ROLE_CONFIGURATIONS: Record<DashboardRole, RoleConfig> = {
  admin: {
    badgeClass: "bg-purple-100 text-purple-800",
    badgeText: "Admin",
    welcomeMessage:
      "Desde aquí puedes gestionar todos los aspectos del sistema Zaga.",
  },
  cliente: {
    badgeClass: "bg-blue-100 text-blue-800",
    badgeText: "Cliente",
    welcomeMessage:
      "Desde aquí puedes ver el estado de tus préstamos y realizar pagos.",
  },
  usuario: {
    badgeClass: "bg-yellow-100 text-yellow-800",
    badgeText: "Usuario",
    welcomeMessage:
      "Bienvenido a Zaga. Completa tu perfil para acceder a todas las funcionalidades.",
  },
};

type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  badgeClass: string;
  badgeText: string;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  badgeClass,
  badgeText,
}) => (
  <div className="bg-white shadow">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}>
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  </div>
);

type DashboardContentProps = {
  userEmail?: string;
  welcomeMessage: string;
  children: React.ReactNode;
};

const DashboardContent: React.FC<DashboardContentProps> = ({
  userEmail,
  welcomeMessage,
  children,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid gap-6">
      {userEmail ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Bienvenido, {userEmail}
          </h2>
          <p className="text-gray-600">{welcomeMessage}</p>
        </div>
      ) : null}
      {children}
    </div>
  </div>
);

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
  const currentRoleConfig = ROLE_CONFIGURATIONS[role] ?? ROLE_CONFIGURATIONS.usuario;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        badgeClass={currentRoleConfig.badgeClass}
        badgeText={currentRoleConfig.badgeText}
      />
      <DashboardContent
        userEmail={userEmail}
        welcomeMessage={currentRoleConfig.welcomeMessage}
      >
        {children}
      </DashboardContent>
    </div>
  );
};
