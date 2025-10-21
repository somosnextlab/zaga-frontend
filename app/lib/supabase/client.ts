'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Configuración de Supabase para el cliente
 */
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Durante el build/prerender, las variables pueden no estar disponibles
  // Retornamos valores por defecto para evitar errores de prerender
  if (!url || !anonKey) {
    if (typeof window === 'undefined') {
      // En el servidor durante build, retornamos valores dummy
      console.warn('Supabase environment variables not available during build');
      return {
        url: 'https://dummy.supabase.co',
        anonKey: 'dummy-key',
      };
    }

    // En el cliente, lanzamos error si no están disponibles
    console.error('Missing Supabase environment variables:', {
      url: !!url,
      anonKey: !!anonKey,
    });
    throw new Error('Supabase configuration is missing');
  }

  return { url, anonKey };
};

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
