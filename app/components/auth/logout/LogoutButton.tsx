"use client";

import { Button } from "@/app/components/ui/Button/Button";
import { useUserContext } from "@/app/context/UserContext/UserContextContext";
import { useState } from "react";
import { ROUTES } from "@/app/utils/constants/routes";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    actions: { reset },
  } = useUserContext();
  const router = useRouter();

  const logout = async () => {
    try {
      setIsLoading(true);
      reset();
      // Auth deshabilitada: no hay sesión que cerrar.
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      router.push(ROUTES.LOGIN);
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
