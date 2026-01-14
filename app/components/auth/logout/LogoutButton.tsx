"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/app/components/ui/Button/Button";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { useState } from "react";
import { ROUTES } from "@/app/utils/constants/routes";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    actions: { reset },
  } = useUserContext();

  const logout = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      reset();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error al cerrar sesión:", error);
        // Aún así redirigir al login aunque haya error
      }
      // Redirigir usando window.location para forzar recarga completa
      // Esto asegura que las cookies se limpien correctamente
      window.location.href = ROUTES.LOGIN;
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      window.location.href = ROUTES.LOGIN;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={logout} disabled={isLoading}>
      {isLoading ? "Cerrando sesión..." : "Logout"}
    </Button>
  );
}
