import { supabaseServer } from '@/app/lib/supabase/server';
import { DashboardLayout } from '@/components/core/DashboardLayout';
import { StatCard } from '@/components/core/StatCard';
import { QuickActions } from '@/components/core/QuickActions';

export const dynamic = 'auto';

export default async function ClientDashboard() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const stats = [
    {
      title: 'Préstamos Activos',
      value: '-',
      icon: 'P',
      iconBg: 'bg-green-500',
    },
    { title: 'Próximo Pago', value: '-', icon: '$', iconBg: 'bg-blue-500' },
    {
      title: 'Días Restantes',
      value: '-',
      icon: '📅',
      iconBg: 'bg-yellow-500',
    },
  ];

  const actions = [
    { title: 'Solicitar Préstamo', icon: '💰', iconBg: 'bg-green-100' },
    { title: 'Realizar Pago', icon: '💳', iconBg: 'bg-blue-100' },
  ];

  return (
    <DashboardLayout
      title="Mi Panel"
      subtitle="Gestiona tus préstamos y pagos"
      userEmail={user?.email}
      role="cliente"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <QuickActions title="Acciones Rápidas" actions={actions} columns={2} />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Actividad Reciente
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No hay actividad reciente</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
