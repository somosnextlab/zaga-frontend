import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchWithHeader } from "@/app/utils/apiCallUtils/apiUtils";
import { LoginAuthResponse } from "@/app/types/login.types";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { UseFetchRoleParams } from "./header.types";

/**
 * Hook personalizado para obtener el rol del usuario autenticado
 */
export const useFetchRole = ({ isAuthenticated, role }: UseFetchRoleParams) => {
  const {
    actions: { setRole },
  } = useUserContext();

  useEffect(() => {
    const fetchRole = async () => {
      // Solo ejecutar si está autenticado pero no tiene rol
      if (!isAuthenticated || role) return;

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) return;

        const { data, error } = await fetchWithHeader({
          url: "/api/auth",
          method: "GET",
          accessToken: session.access_token,
        });

        if (!error && data) {
          const authResponse = data as LoginAuthResponse;
          const { role: userRole } = authResponse.data;
          setRole(userRole);
        }
      } catch (error) {
        // Silenciar errores, no es crítico
        console.warn("Error al obtener rol:", error);
      }
    };

    fetchRole();
  }, [isAuthenticated, role, setRole]);
};
