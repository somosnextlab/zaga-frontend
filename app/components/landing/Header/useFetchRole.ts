import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { UseFetchRoleParams } from "./header.types";

/**
 * Hook personalizado para obtener el rol del usuario autenticado
 */
export const useFetchRole = ({ isAuthenticated, role }: UseFetchRoleParams) => {
  const {
    actions: { setRole },
  } = useUserContext();

  // Autenticación/roles deshabilitados (Supabase retirado).
  // Mantener signature para no romper `Header`.
  void isAuthenticated;
  void role;
  void setRole;
};
