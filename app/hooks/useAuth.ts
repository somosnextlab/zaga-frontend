"use client";

/**
 * Hook personalizado para gestionar el estado de autenticación del usuario
 * @returns Objeto con el usuario actual, estado de carga y función para actualizar el usuario
 */
type AuthUser = {
  role: string;
};

export function useAuth(): { user: AuthUser | null; loading: boolean } {
  // Autenticación deshabilitada (Supabase fue retirado del proyecto).
  // Mantenemos la API del hook para no romper consumidores existentes.
  return { user: null, loading: false };
}
