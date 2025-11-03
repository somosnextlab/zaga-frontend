import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout específico para rutas privadas (usuarios y clientes)
 * Verifica que el usuario esté autenticado antes de renderizar
 */
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verificar autenticación
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </main>
  );
}
