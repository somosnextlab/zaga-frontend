import { UserRoleEnum } from "../types/user.types";
import { ROUTES } from "./constants/routes";

/**
 * Mapea un rol de usuario a su ruta de dashboard correspondiente
 * @param role - Rol del usuario
 * @returns Ruta del dashboard correspondiente al rol, o landing page si el rol no es reconocido
 */
export function getDashboardRouteByRole(role: string): string {
  const normalizedRole = role.toLowerCase().trim();

  switch (normalizedRole) {
    case UserRoleEnum.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case UserRoleEnum.USUARIO:
    case UserRoleEnum.CLIENTE:
      return ROUTES.USER_DASHBOARD;
    default:
      // Si el rol no es reconocido, redirigir a la landing page por seguridad
      return ROUTES.HOME;
  }
}
