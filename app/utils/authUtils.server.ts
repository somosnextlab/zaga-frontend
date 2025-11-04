import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchWithHeaderServer } from "./apiCallUtils/apiUtils.server";
import { STATUS_OK } from "./constants/statusResponse";
import { ROUTES } from "./constants/routes";
import { getDashboardRouteByRole } from "./roleUtils";
import type { LoginAuthResponse } from "../types/login.types";
import type { UserRole } from "../types/user.types";
import { UserRoleEnum } from "../types/user.types";

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
  try {
    // Verificar autenticación con Supabase
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();

    if (claimsError || !claimsData?.claims) {
      return {
        role: null,
        error: new Error("Usuario no autenticado"),
      };
    }

    // Obtener el token de acceso
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {
        role: null,
        error: new Error("Token de acceso no disponible"),
      };
    }

    // Llamar al backend para obtener el rol
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseUrl) {
      return {
        role: null,
        error: new Error("URL del backend no configurada"),
      };
    }

    const response = await fetchWithHeaderServer({
      url: `${baseUrl}/auth/me`,
      method: "GET",
      accessToken: session.access_token,
    });

    if (response.status !== STATUS_OK) {
      return {
        role: null,
        error: new Error(
          `Error al obtener rol del usuario: ${response.status}`
        ),
      };
    }

    const data: LoginAuthResponse = await response.json();

    if (!data.success || !data.data?.role) {
      return {
        role: null,
        error: new Error("Rol no disponible en la respuesta del backend"),
      };
    }

    // Normalizar el rol
    const normalizedRole = data.data.role.toLowerCase().trim() as UserRole;

    // Validar que el rol sea válido
    const validRoles = Object.values(UserRoleEnum);
    if (!validRoles.includes(normalizedRole)) {
      return {
        role: null,
        error: new Error(`Rol inválido: ${normalizedRole}`),
      };
    }

    return {
      role: normalizedRole,
      error: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return {
      role: null,
      error: new Error(`Error al obtener rol: ${errorMessage}`),
    };
  }
}

/**
 * Valida que el usuario tenga uno de los roles permitidos
 * @param allowedRoles - Array de roles permitidos
 * @returns El rol del usuario si es válido, o redirige a login si no lo es
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<UserRole> {
  const { role, error } = await getUserRole();

  if (error || !role) {
    redirect(ROUTES.LOGIN);
  }

  if (!allowedRoles.includes(role)) {
    // Si el usuario no tiene el rol permitido, redirigir a su dashboard
    const dashboardRoute = getDashboardRouteByRole(role);
    redirect(dashboardRoute);
  }

  return role;
}

/**
 * Valida que el usuario tenga rol de administrador
 * @returns El rol del usuario si es admin, o redirige si no lo es
 */
export async function requireAdmin(): Promise<UserRole> {
  return requireRole([UserRoleEnum.ADMIN]);
}
