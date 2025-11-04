import { requireRole } from "@/app/utils/authUtils.server";
import { UserRoleEnum } from "@/app/types/user.types";

/**
 * Layout específico para rutas privadas (usuarios y clientes)
 * Verifica que el usuario tenga rol de usuario o cliente antes de renderizar
 * Los administradores no pueden acceder a estas rutas
 */
export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar que el usuario tenga rol de usuario o cliente
  // Si tiene rol de admin, redirige automáticamente a su dashboard
  // Si no está autenticado, redirige a login
  await requireRole([UserRoleEnum.USUARIO, UserRoleEnum.CLIENTE]);

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </main>
  );
}
