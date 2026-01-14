"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Modos disponibles para el Header
 */
export type HeaderMode = "landing" | "protected" | "auth";

/**
 * Configuración del Header según el modo actual
 */
export interface HeaderConfig {
  mode: HeaderMode;
  showLandingNavigation: boolean;
  showProtectedNavigation: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook para determinar la configuración del Header según la ruta actual
 * y el estado de autenticación del usuario
 * @returns Configuración del Header con el modo y qué elementos mostrar
 */
export function useHeaderMode(): HeaderConfig {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAuthenticated = user?.role === "authenticated";
  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedPage = pathname.startsWith("/adminDashboard");

  // Determinar el modo del header
  let mode: HeaderMode;
  if (isProtectedPage) {
    mode = "protected";
  } else if (isAuthPage) {
    mode = "auth";
  } else {
    mode = "landing";
  }

  // Determinar qué navegación mostrar
  const showLandingNavigation = mode === "landing" && !isAuthenticated;
  const showProtectedNavigation = mode === "protected" && isAuthenticated;

  return {
    mode,
    showLandingNavigation,
    showProtectedNavigation,
    isAuthenticated,
  };
}
