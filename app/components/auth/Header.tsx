'use client';

import Link from 'next/link';
import { useAuthContext } from './AuthProvider';
import { ROUTES } from '../../lib/constants/routes';
import { MobileMenu } from '../MobileMenu';

export const Header: React.FC = () => {
  const { user, role, signOut } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

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

          {!user && (
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
          {user && (
            <>
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
            </>
          )}

          <MobileMenu user={user} />
        </div>
      </nav>
    </header>
  );
};
