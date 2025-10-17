'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../lib/constants/routes';
import { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  user?: User | null;
  role?: string | null;
}

export function MobileMenu({ user, role }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getDashboardRoute = (): string => {
    return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD;
  };

  // Determinar si estamos en la landing page o en un dashboard
  const isLandingPage = pathname === '/';
  const isDashboardPage =
    pathname === ROUTES.ADMIN_DASHBOARD || pathname === ROUTES.USER_DASHBOARD;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-[rgb(var(--color-muted))] transition-colors"
        aria-label="Abrir menú de navegación"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-[rgb(var(--color-foreground))]" />
        ) : (
          <Menu className="h-5 w-5 text-[rgb(var(--color-foreground))]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg shadow-lg z-50 md:hidden">
          <nav className="py-2">
            {/* Solo mostrar links de navegación en landing page cuando no hay usuario autenticado */}
            {(!user || user === null) && isLandingPage && (
              <>
                <a
                  href="#beneficios"
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  ¿Por qué elegir Zaga?
                </a>
                <a
                  href="#como-funciona"
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Cómo funciona
                </a>
                <a
                  href="#faq"
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Preguntas
                </a>
                <div className="border-t border-[rgb(var(--color-border))] my-2"></div>
              </>
            )}

            {(!user || user === null) && (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href={ROUTES.REGISTER || '/auth/register'}
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Crear cuenta
                </Link>
              </>
            )}
            {user && (
              <>
                {/* Solo mostrar botón "Ir a dashboard" en la landing page (no en dashboards) */}
                {isLandingPage && !isDashboardPage && (
                  <Link
                    href={getDashboardRoute()}
                    className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                    onClick={toggleMenu}
                  >
                    Ir a dashboard
                  </Link>
                )}
                {role && (
                  <div className="px-4 py-2 text-sm text-[rgb(var(--color-foreground))] opacity-70">
                    Rol: {role}
                  </div>
                )}
                <form action={ROUTES.SIGNOUT} method="post">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                    onClick={toggleMenu}
                  >
                    Salir
                  </button>
                </form>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
