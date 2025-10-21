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
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const codeVerifier = searchParams.get('code_verifier');

    console.log('Auth callback received:', {
      url: request.url,
      origin,
      code: !!code,
      codeValue: code?.substring(0, 10) + '...',
      codeVerifier: !!codeVerifier,
      error,
      errorDescription,
    });

    // Si hay un error en los parámetros de Supabase, redirigir con error
    if (error) {
      console.error('Supabase auth error:', error, errorDescription);
      return NextResponse.redirect(
        `${origin}/auth/verify-email?error=verification_failed`
      );
    }

    if (code) {
      console.log('Processing code exchange...');
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

      console.log('Attempting code exchange...');
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      console.log('Code exchange result:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasError: !!exchangeError,
        errorMessage: exchangeError?.message,
      });

      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(
          `${origin}/auth/verify-email?error=verification_failed`
        );
      }

      if (data?.session) {
        // Obtener el usuario después del intercambio de código
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        console.log('Get user result:', {
          hasUser: !!user,
          hasError: !!userError,
          errorMessage: userError?.message,
          emailConfirmed: user?.email_confirmed_at,
        });

        if (userError) {
          console.error('Get user error:', userError);
          return NextResponse.redirect(
            `${origin}/auth/verify-email?error=verification_failed`
          );
        }

        if (user && user.email_confirmed_at) {
          // Si el email está confirmado, redirigir con los tokens
          console.log('Email confirmed, redirecting with tokens');
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

          console.log('Redirecting to:', redirectUrl.toString());
          return NextResponse.redirect(redirectUrl.toString());
        } else {
          // Si el email no está confirmado, redirigir con error
          return NextResponse.redirect(
            `${origin}/auth/verify-email?error=email_not_confirmed`
          );
        }
      }
    }

    // Si no hay código, redirigir a la página de verificación con error
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
