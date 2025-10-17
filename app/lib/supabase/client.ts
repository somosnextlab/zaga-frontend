'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Configuración de Supabase para el cliente
 */
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
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
 */
export const supabaseClient = () => {
  return createBrowserClient(
    getSupabaseConfig().url,
    getSupabaseConfig().anonKey
  );
};
