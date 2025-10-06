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
 */
export const supabaseClient = () => {
  return createBrowserClient(
    getSupabaseConfig().url,
    getSupabaseConfig().anonKey
  );
};
