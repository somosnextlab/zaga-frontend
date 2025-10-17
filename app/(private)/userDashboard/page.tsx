'use client';

import { DashboardLayout } from '@/components/core/DashboardLayout';
import { StatCard } from '@/components/core/StatCard';
import { QuickActions } from '@/components/core/QuickActions';
import { AuthGuard } from '@/app/components/auth/AuthGuard';
import { useAuthContext } from '@/app/components/auth/AuthProvider';

export default function UserDashboard() {
  const { user, role } = useAuthContext();

  // Configuración dinámica según el rol
  const getDashboardConfig = () => {
    if (role === 'cliente') {
      return {
        title: 'Mi Panel',
        subtitle: 'Gestiona tus préstamos y pagos',
        stats: [
          {
            title: 'Préstamos Activos',
            value: '-',
            icon: 'P',
            iconBg: 'bg-green-500',
          },
          {
            title: 'Próximo Pago',
            value: '-',
            icon: '$',
            iconBg: 'bg-blue-500',
          },
          {
            title: 'Días Restantes',
            value: '-',
            icon: '📅',
            iconBg: 'bg-yellow-500',
          },
        ],
        actions: [
          { title: 'Solicitar Préstamo', icon: '💰', iconBg: 'bg-green-100' },
          { title: 'Realizar Pago', icon: '💳', iconBg: 'bg-blue-100' },
        ],
        showLoanFeatures: true,
      };
    } else {
      // Rol 'usuario' - funcionalidades limitadas
      return {
        title: 'Mi Panel',
        subtitle: 'Completa tu perfil para acceder a todas las funcionalidades',
        stats: [
          {
            title: 'Estado de Cuenta',
            value: 'Pendiente',
            icon: '👤',
            iconBg: 'bg-yellow-500',
          },
          {
            title: 'Próximos Pasos',
            value: 'Completar perfil',
            icon: '📝',
            iconBg: 'bg-blue-500',
          },
          {
            title: 'Funcionalidades',
            value: 'Limitadas',
            icon: '🔒',
            iconBg: 'bg-gray-500',
          },
        ],
        actions: [
          { title: 'Completar Perfil', icon: '📝', iconBg: 'bg-yellow-100' },
          { title: 'Ver Información', icon: 'ℹ️', iconBg: 'bg-blue-100' },
        ],
        showLoanFeatures: false,
      };
    }
  };

  const config = getDashboardConfig();

  return (
    <AuthGuard requireAuth={true}>
      <DashboardLayout
        title={config.title}
        subtitle={config.subtitle}
        userEmail={user?.email}
        role={role as 'admin' | 'cliente' | 'usuario'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          ))}
        </div>

        <QuickActions
          title="Acciones Rápidas"
          actions={config.actions}
          columns={2}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {config.showLoanFeatures
              ? 'Actividad Reciente'
              : 'Información de Cuenta'}
          </h3>
          <div className="text-center py-8">
            {config.showLoanFeatures ? (
              <p className="text-gray-500">No hay actividad reciente</p>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500">
                  Tu cuenta está configurada como <strong>usuario</strong>.
                </p>
                <p className="text-sm text-gray-400">
                  Para acceder a todas las funcionalidades de préstamos,
                  completa tu perfil cuando solicites tu primer crédito.
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
