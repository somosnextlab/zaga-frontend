'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import './Header.module.scss';
import { ROUTES } from '@/app/utils/constants/routes';
import { Button } from '@/app/components/ui/button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading] = useState(false);
  const user = false;
  const role = '';
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    console.log('sign out');
  };

  const handleSolicitarPrestamo = async () => {
    console.log('solicitar prestamo');
  };

  const getDashboardRoute = (): string => {
    /* return role === 'admin' ? ROUTES.ADMIN_DASHBOARD : ROUTES.USER_DASHBOARD; */
    return '';
  };

  // Determinar si estamos en la landing page (no en un dashboard)
  const isLandingPage = pathname === '/';
  const isDashboardPage =
    pathname === ROUTES.ADMIN_DASHBOARD || pathname === ROUTES.USER_DASHBOARD;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-[hsl(var(--color-zaga-green-gray))]">
                Zaga
              </span>
              <span className="opacity-70 text-sm font-normal text-[hsl(var(--color-zaga-black))]">
                by NextLab
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Solo mostrar si no hay usuario logueado */}
          {!user && isLandingPage && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="#beneficios"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Beneficios
              </Link>
              <Link
                href="#como-funciona"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Cómo funciona
              </Link>
              <Link
                href="#faq"
                className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
              >
                Preguntas
              </Link>
            </nav>
          )}

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={ROUTES.LOGIN}>Iniciar sesión</Link>
                </Button>
                <Button
                  className="bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white"
                  onClick={handleSolicitarPrestamo}
                  disabled={isLoading}
                >
                  {isLoading ? 'Procesando...' : 'Solicitar préstamo'}
                </Button>
              </>
            ) : (
              <>
                {/* Solo mostrar botón "Ir a dashboard" en la landing page */}
                {isLandingPage && !isDashboardPage && (
                  <Button
                    className="bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white"
                    asChild
                  >
                    <Link href={getDashboardRoute()}>Ir a dashboard</Link>
                  </Button>
                )}
                {role && (
                  <span className="text-sm text-[hsl(var(--color-zaga-text))] opacity-70">
                    Rol: {role}
                  </span>
                )}
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-[hsl(var(--color-zaga-green-gray))] text-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-gray))] hover:text-white"
                >
                  Salir
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation - Solo mostrar si no hay usuario logueado */}
              {!user && isLandingPage && (
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="#beneficios"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Beneficios
                  </Link>
                  <Link
                    href="#como-funciona"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Cómo funciona
                  </Link>
                  <Link
                    href="#faq"
                    className="text-[hsl(var(--color-zaga-text))] hover:text-[hsl(var(--color-zaga-green-gray))] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Preguntas
                  </Link>
                </nav>
              )}

              {/* CTAs */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {!user ? (
                  <>
                    <Button variant="ghost" asChild className="justify-start">
                      <Link
                        href={ROUTES.LOGIN}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar sesión
                      </Link>
                    </Button>
                    <Button
                      className="bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white justify-start"
                      onClick={() => {
                        handleSolicitarPrestamo();
                        setIsMenuOpen(false);
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Procesando...' : 'Solicitar préstamo'}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Solo mostrar botón "Ir a dashboard" en la landing page */}
                    {isLandingPage && !isDashboardPage && (
                      <Button
                        className="bg-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-hover))] text-white justify-start"
                        asChild
                      >
                        <Link
                          href={getDashboardRoute()}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Ir a dashboard
                        </Link>
                      </Button>
                    )}
                    {role && (
                      <div className="text-sm text-[hsl(var(--color-zaga-text))] opacity-70 py-2">
                        Rol: {role}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="border-[hsl(var(--color-zaga-green-gray))] text-[hsl(var(--color-zaga-green-gray))] hover:bg-[hsl(var(--color-zaga-green-gray))] hover:text-white justify-start"
                    >
                      Salir
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
