import React from 'react';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  userEmail?: string;
  role: 'admin' | 'cliente';
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  userEmail,
  role,
  children,
}) => {
  const roleConfig = {
    admin: {
      badgeClass: 'bg-purple-100 text-purple-800',
      badgeText: 'Admin',
    },
    cliente: {
      badgeClass: 'bg-blue-100 text-blue-800',
      badgeText: 'Cliente',
    },
  };

  const config = roleConfig[role];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${config.badgeClass}`}
              >
                {config.badgeText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {userEmail && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenido, {userEmail}
              </h2>
              <p className="text-gray-600">
                {role === 'admin'
                  ? 'Desde aquí puedes gestionar todos los aspectos del sistema Zaga.'
                  : 'Desde aquí puedes ver el estado de tus préstamos y realizar pagos.'}
              </p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};
