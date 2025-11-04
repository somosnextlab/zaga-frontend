import { requireAdmin } from "@/app/utils/authUtils.server";

/**
 * Layout específico para rutas de administrador
 * Verifica que el usuario tenga rol de admin antes de renderizar
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar que el usuario tenga rol de admin
  // Si no tiene el rol correcto, redirige automáticamente
  await requireAdmin();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </main>
  );
}
