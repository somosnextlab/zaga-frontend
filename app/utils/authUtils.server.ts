import { ROUTES } from "./constants/routes";
import type { UserRole } from "../types/user.types";
import { redirect } from "next/navigation";

/**
 * Resultado de la obtención del rol del usuario
 */
export interface GetUserRoleResult {
  role: UserRole | null;
  error: Error | null;
}

/**
 * Obtiene el rol del usuario autenticado desde el backend
 * @returns Objeto con el rol del usuario o un error si no se pudo obtener
 */
export async function getUserRole(): Promise<GetUserRoleResult> {
  return {
    role: null,
    error: new Error(
      "Autenticación deshabilitada: el proyecto ya no utiliza Supabase."
    ),
  };
}

/**
 * Valida que el usuario tenga uno de los roles permitidos
 * @param allowedRoles - Array de roles permitidos
 * @returns El rol del usuario si es válido, o redirige a login si no lo es
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserRole> {
  void allowedRoles;
  redirect(`${ROUTES.LOGIN}?message=Autenticación en mantenimiento`);
}

/**
 * Valida que el usuario tenga rol de administrador
 * @returns El rol del usuario si es admin, o redirige si no lo es
 */
export async function requireAdmin(): Promise<UserRole> {
  return await requireRole([]);
}
