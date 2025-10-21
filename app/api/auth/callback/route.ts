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

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.session) {
        // Obtener el usuario después del intercambio de código
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && user.email_confirmed_at) {
          // Si el email está confirmado, redirigir con los tokens
          const redirectUrl = new URL(`${origin}/auth/verify-email`);
          redirectUrl.searchParams.set(
            'access_token',
            data.session.access_token
          );
          redirectUrl.searchParams.set(
            'refresh_token',
            data.session.refresh_token
          );
          redirectUrl.searchParams.set('verified', 'true');

          return NextResponse.redirect(redirectUrl.toString());
        } else {
          // Si el email no está confirmado, redirigir con error
          return NextResponse.redirect(
            `${origin}/auth/verify-email?error=email_not_confirmed`
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
