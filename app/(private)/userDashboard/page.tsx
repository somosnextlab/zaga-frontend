import { supabaseServer } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/utils/auth';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

export default async function ClientDashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const role = getUserRole(user);
  
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi Panel (Cliente)</h1>
        <span className="text-sm text-muted-foreground">Rol: {role}</span>
      </div>
      <p className="text-muted-foreground">
        Hola {user?.email}. Aquí verás tu préstamo, pagos y estado.
      </p>
    </section>
  );
}
