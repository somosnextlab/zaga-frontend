"use client";

import Link from "next/link";
import { Button } from "../../ui/Button/Button";
import { LogoutButton } from "../logout/LogoutButton";
import { useAuth } from "@/app/hooks/useAuth";

/**
 * Componente que muestra los botones de autenticación o la información del usuario
 * dependiendo del estado de autenticación
 */
export function AuthButton() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant={"outline"} disabled>
          Iniciar sesión
        </Button>
        <Button size="sm" variant={"default"} disabled>
          Registrarme
        </Button>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hola, {user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Iniciar sesión</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Registrarme</Link>
      </Button>
    </div>
  );
}
