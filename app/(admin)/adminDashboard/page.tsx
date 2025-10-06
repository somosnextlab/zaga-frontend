import { supabaseServer } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/utils/auth';

// Permitir que Next.js decida automáticamente el tipo de renderizado
export const dynamic = 'auto';

export default async function AdminDashboard() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const role = getUserRole(user);
  
  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel Administrativo</h1>
        <span className="text-sm text-muted-foreground">Rol: {role}</span>
      </div>
      <p className="text-muted-foreground">
        Hola {user?.email}. Aquí verás métricas, solicitudes y gestión.
      </p>
    </section>
  );
}
