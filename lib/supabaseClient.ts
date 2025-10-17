'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Configuración de Supabase para el cliente
 */
const getSupabaseConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

/**
 * Cliente de Supabase para componentes del cliente
 * Wrapper simplificado para autenticación
 */
export const supabaseClient = () => {
  return createBrowserClient(
    getSupabaseConfig().url,
    getSupabaseConfig().anonKey
  );
};

/**
 * Obtiene el token de acceso actual del usuario autenticado
 */
export const getAccessToken = async (): Promise<string | null> => {
  const supabase = supabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};

/**
 * Obtiene la información del usuario actual
 */
export const getCurrentUser = async () => {
  const supabase = supabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * Obtiene el rol del usuario desde app_metadata
 */
export const getUserRole = async (): Promise<string | null> => {
  const user = await getCurrentUser();
  return user?.app_metadata?.role || null;
};
