import type { ReactNode } from "react";
import { AuthMaintenanceNotice } from "@/app/components/auth/AuthMaintenanceNotice";

/**
 * Layout específico para rutas de administrador
 * Verifica que el usuario tenga rol de admin antes de renderizar
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  void children;

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AuthMaintenanceNotice
            title="Panel administrativo en mantenimiento"
            description="El panel de administración está temporalmente deshabilitado mientras migramos el sistema de autenticación."
          />
        </div>
      </div>
    </main>
  );
}
