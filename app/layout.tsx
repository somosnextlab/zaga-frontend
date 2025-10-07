import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { supabaseServer } from './lib/supabase/server';
import { ROUTES } from './lib/constants/routes';
import { getUserRole } from './lib/utils/auth';
import { MobileMenu } from './components/MobileMenu';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zaga - Préstamos online rápidos y simples',
  description: 'Financiación ágil, 100% digital. Con tu DNI y CBU en minutos.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user ? getUserRole(user) : null;

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
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
                <span className="opacity-70 text-sm font-normal">
                  by NextLab
                </span>
              </Link>

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
                  <button
                    className="hidden sm:block px-4 py-2 bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))] rounded-lg hover:bg-[rgb(var(--color-primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled
                    title="Próximamente"
                    aria-label="Crear cuenta - Próximamente"
                  >
                    Crear cuenta
                  </button>
                </>
              )}
              {user && (
                <>
                  <span
                    className="text-sm text-[rgb(var(--color-foreground))] opacity-70"
                    aria-label={`Rol actual: ${role}`}
                  >
                    Rol: {role}
                  </span>
                  <form action={ROUTES.SIGNOUT} method="post">
                    <button
                      className="px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 transition-colors"
                      type="submit"
                      aria-label="Cerrar sesión"
                    >
                      Salir
                    </button>
                  </form>
                </>
              )}
              
              {/* Menú móvil */}
              <MobileMenu user={user} />
            </div>
          </nav>
        </header>
        <main className="px-4">{children}</main>
      </body>
    </html>
  );
}
