'use client';

import { DashboardLayout } from '@/components/core/DashboardLayout/DashboardLayout';
import { StatCard } from '@/components/core/StatCard/StatCard';
import { QuickActions } from '@/components/core/QuickActions/QuickActions';
import { AuthGuard } from '@/app/components/auth/AuthGuard/AuthGuard';
import { useAuthContext } from '@/app/components/auth/ConditionalAuthProvider/ConditionalAuthProvider';

// Deshabilitar prerenderizado para esta página
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { user } = useAuthContext();

  const stats = [
    { title: 'Usuarios', value: '-', icon: 'U', iconBg: 'bg-blue-500' },
    { title: 'Préstamos', value: '-', icon: 'P', iconBg: 'bg-green-500' },
    { title: 'Activos', value: '-', icon: 'A', iconBg: 'bg-yellow-500' },
    { title: 'Rechazados', value: '-', icon: 'R', iconBg: 'bg-red-500' },
  ];

  const actions = [
    { title: 'Gestionar Usuarios', icon: '👥', iconBg: 'bg-blue-100' },
    { title: 'Revisar Préstamos', icon: '💰', iconBg: 'bg-green-100' },
    { title: 'Ver Reportes', icon: '📊', iconBg: 'bg-purple-100' },
  ];

  return (
    <AuthGuard requireAuth={true} requireRole="admin">
      <DashboardLayout
        title="Panel Administrativo"
        subtitle="Gestión completa del sistema Zaga"
        userEmail={user?.email}
        role="admin"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconBg={stat.iconBg}
            />
          ))}
        </div>

        <QuickActions title="Acciones Rápidas" actions={actions} columns={3} />
      </DashboardLayout>
    </AuthGuard>
  );
}
