'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from './ConditionalAuthProvider';
import { ROUTES } from '../../lib/constants/routes';
import { MobileMenu } from '../MobileMenu';

export const Header: React.FC = () => {
  const { user, role, signOut } = useAuthContext();
  const pathname = usePathname();


  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getDashboardRoute = (): string => {
    return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
  };

  // Determinar si estamos en la landing page (no en un dashboard)
  const isLandingPage = pathname === '/';
  const isDashboardPage = pathname === ROUTES.ADMIN_DASHBOARD || pathname === ROUTES.USER_DASHBOARD;

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]/95 backdrop-blur-sm">
      <nav
        className="container mx-auto px-4 flex h-16 items-center justify-between"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-bold tracking-tight text-[rgb(var(--color-primary))]"
            aria-label="Zaga - Ir al inicio"
          >
            Zaga{' '}
            <span className="opacity-70 text-sm font-normal">by NextLab</span>
          </Link>

          {!user && isLandingPage && (
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a
                href="#beneficios"
                className="text-[rgb(var(--color-foreground))] opacity-80 hover:opacity-100 hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                ¿Por qué elegir Zaga?
              </a>
              <a
                href="#como-funciona"
                className="text-[rgb(var(--color-foreground))] opacity-80 hover:opacity-100 hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Cómo funciona
              </a>
              <a
                href="#faq"
                className="text-[rgb(var(--color-foreground))] opacity-80 hover:opacity-100 hover:text-[rgb(var(--color-primary))] transition-colors"
              >
                Preguntas
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="hidden sm:block px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 transition-colors"
                aria-label="Iniciar sesión"
              >
                Iniciar sesión
              </Link>
              <Link
                href={ROUTES.REGISTER || '/auth/register'}
                className="hidden sm:block px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 transition-colors"
                aria-label="Crear cuenta"
              >
                Crear cuenta
              </Link>
            </>
          )}
          
          {/* Solo mostrar elementos de usuario en desktop (hidden en móvil) */}
          {user && (
            <div className="hidden md:flex items-center gap-3">
              {/* Solo mostrar botón "Ir a dashboard" en la landing page (no en dashboards) */}
              {isLandingPage && !isDashboardPage && (
                <Link
                  href={getDashboardRoute()}
                  className="px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 transition-colors"
                  aria-label="Ir a dashboard"
                >
                  Ir a dashboard
                </Link>
              )}
              {role && (
                <span
                  className="text-sm text-[rgb(var(--color-foreground))] opacity-70"
                  aria-label={`Rol actual: ${role}`}
                >
                  Rol: {role}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 transition-colors"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          )}

          <MobileMenu user={user} role={role} />
        </div>
      </nav>
    </header>
  );
};
