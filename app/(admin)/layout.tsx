import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout específico para rutas de administrador
 * Verifica que el usuario tenga rol de admin antes de renderizar
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Verificar autenticación y rol
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // TODO: Verificar que el usuario tenga rol de admin
  // Actualmente solo verifica autenticación
  // Implementar verificación de rol cuando esté disponible en los claims

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </main>
  );
}
