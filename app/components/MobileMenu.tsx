'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '../lib/constants/routes';
import { User } from '../lib/types/auth';

interface MobileMenuProps {
  user?: User | null;
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Cerrar menú al hacer clic fuera
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
      {/* Botón hamburguesa */}
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

      {/* Menú dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg shadow-lg z-50 md:hidden">
          <nav className="py-2">
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
            
            {/* Separador */}
            <div className="border-t border-[rgb(var(--color-border))] my-2"></div>
            
            {/* Botones de autenticación */}
            {!user && (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="block px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Iniciar sesión
                </Link>
                <button
                  className="w-full text-left px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                  title="Próximamente"
                  onClick={toggleMenu}
                >
                  Crear cuenta
                </button>
              </>
            )}
            {user && (
              <form action={ROUTES.SIGNOUT} method="post">
                <button
                  type="submit"
                  className="w-full text-left px-4 py-3 text-[rgb(var(--color-foreground))] hover:bg-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
                  onClick={toggleMenu}
                >
                  Salir
                </button>
              </form>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
