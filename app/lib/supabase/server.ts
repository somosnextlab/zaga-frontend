import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Configuración de Supabase para el servidor
 */
const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Durante el build/prerender, las variables pueden no estar disponibles
  // Retornamos valores por defecto para evitar errores de prerender
  if (!url || !anonKey) {
    console.warn('Supabase environment variables not available during build');
    return {
      url: 'https://dummy.supabase.co',
      anonKey: 'dummy-key',
    };
  }

  return { url, anonKey };
};

/**
 * Cliente de Supabase para Server Components
 */
export const supabaseServer = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseConfig().url,
    getSupabaseConfig().anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

/**
 * Cliente de Supabase para middleware
 */
export const supabaseMiddleware = (req: NextRequest, res: NextResponse) => {
  return createServerClient(
    getSupabaseConfig().url,
    getSupabaseConfig().anonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value);
          });
        },
      },
    }
  );
};
