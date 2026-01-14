import { requireAdmin } from "@/app/utils/authUtils.server";
import type { ReactNode } from "react";
import { LogoutButton } from "@/app/components/auth/logout/LogoutButton";

/**
 * Layout específico para rutas de administrador
 * Verifica que el usuario tenga rol de admin antes de renderizar
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Verificar que el usuario tenga rol de admin
  // Si no tiene el rol correcto, redirige automáticamente
  await requireAdmin();

  return (
    <main className="min-h-screen flex flex-col">
      <div className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </main>
  );
}
