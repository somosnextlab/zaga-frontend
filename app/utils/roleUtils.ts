import { UserRoleEnum } from "../types/user.types";
import { ROUTES } from "./constants/routes";

/**
 * Mapea un rol de usuario a su ruta de dashboard correspondiente
 * @param role - Rol del usuario
 * @returns Ruta del dashboard correspondiente al rol, o landing page si no es admin
 */
export function getDashboardRouteByRole(role: string): string {
  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case UserRoleEnum.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    default:
      // Si el rol no es reconocido, redirigir a la landing page por seguridad
      return ROUTES.HOME;
  }
}
