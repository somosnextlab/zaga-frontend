import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseConfig } from './config';

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
