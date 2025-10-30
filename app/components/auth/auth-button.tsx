"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogoutButton } from "./logout-button";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function AuthButton({
  setUser,
  user,
}: {
  setUser: (user: User | null) => void;
  user: User | null;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Obtener el usuario actual
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.warn("Error al obtener usuario:", error);
        setLoading(false);
      }
    };

    getUser();

    // Escuchar cambios en el estado de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      try {
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.warn("Error en cambio de autenticación:", error);
        setLoading(false);
      }
    });

    return () => {
      try {
        subscription.unsubscribe();
      } catch (error) {
        console.warn("Error al desuscribirse:", error);
      }
    };
  }, []);

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
      Hey, {user.email}!
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
