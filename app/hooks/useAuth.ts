"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Hook personalizado para gestionar el estado de autenticación del usuario
 * @returns Objeto con el usuario actual, estado de carga y función para actualizar el usuario
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
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

  return { user, loading };
}
