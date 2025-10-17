import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import {
  getUserRole,
  getDashboardRoute,
  isProtectedRoute,
  isAdminRoute,
} from './app/lib/utils/auth';
import { ROUTES } from './app/lib/constants/routes';

/**
 * Middleware de autenticación y autorización
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Solo procesar rutas que requieren autenticación
  if (!isProtectedRoute(pathname) && !isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Crear cliente de Supabase para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirigir usuarios no autenticados que intentan acceder a rutas protegidas
  if (!user && isProtectedRoute(pathname)) {
    return createRedirectResponse(req, ROUTES.LOGIN, { redirectTo: pathname });
  }

  // Redirigir usuarios autenticados que intentan acceder al login o registro
  if (user && (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)) {
    const role = getUserRole(user);
    const dashboardRoute = getDashboardRoute(role);
    return createRedirectResponse(req, dashboardRoute);
  }

  // Verificar permisos de admin para rutas administrativas
  if (user && isAdminRoute(pathname)) {
    const role = getUserRole(user);
    if (role !== 'admin') {
      return createRedirectResponse(req, ROUTES.USER_DASHBOARD);
    }
  }

  return response;
}

/**
 * Crea una respuesta de redirección con parámetros opcionales
 */
function createRedirectResponse(
  req: NextRequest,
  pathname: string,
  searchParams?: Record<string, string>
) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
