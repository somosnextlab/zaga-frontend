import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Endpoint de callback para Supabase Auth
 * Maneja la verificación de email y otros callbacks de autenticación
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      const cookieStore = await cookies();

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Verificar si el usuario necesita completar su perfil
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Redirigir a la página de verificación de email para mostrar el estado
          return NextResponse.redirect(
            `${origin}/auth/verify-email?verified=true`
          );
        }
      }
    }

    // Si hay error o no hay código, redirigir a la página de verificación con error
    return NextResponse.redirect(
      `${origin}/auth/verify-email?error=verification_failed`
    );
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/auth/verify-email?error=verification_failed`
    );
  }
}

/**
 * Manejar peticiones POST (por si Supabase envía POST)
 */
export async function POST(request: NextRequest) {
  // Redirigir POST a GET para manejar el callback
  return GET(request);
}
