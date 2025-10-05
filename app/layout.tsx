import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { supabaseServer } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/utils/auth';
import { ROUTES } from '@/lib/constants/routes';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zaga - Préstamos online rápidos y simples",
  description: "Financiación ágil, 100% digital. Con tu DNI y CBU en minutos.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const role = user ? getUserRole(user) : null;

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <header className="border-b">
          <nav className="container mx-auto flex h-14 items-center justify-between" role="navigation" aria-label="Navegación principal">
            <Link href="/" className="font-semibold" aria-label="Zaga - Ir al inicio">
              Zaga
            </Link>

            <div className="flex items-center gap-3">
              {!user && (
                <Link 
                  href={ROUTES.LOGIN} 
                  className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1"
                  aria-label="Iniciar sesión"
                >
                  Iniciar sesión
                </Link>
              )}
              {user && (
                <>
                  <span className="text-sm opacity-70" aria-label={`Rol actual: ${role}`}>
                    Rol: {role}
                  </span>
                  <form action={ROUTES.SIGNOUT} method="post">
                    <button 
                      className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm px-1" 
                      type="submit"
                      aria-label="Cerrar sesión"
                    >
                      Salir
                    </button>
                  </form>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="container mx-auto py-8">{children}</main>
      </body>
    </html>
  );
}
